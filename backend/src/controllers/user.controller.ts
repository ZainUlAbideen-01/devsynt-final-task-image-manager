import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Verification } from "../models/verification.model.js";
import crypto from "crypto"
import { createTransporter } from '../services/mail.service.js';
import { PasswordReset } from "../models/passwordReset.model.js"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body

    if (!email) {
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(200).json({
            message: "If the email exists, a reset link has been sent"
        })
    }

    await PasswordReset.deleteMany({ userId: user._id })

    const token = crypto.randomBytes(32).toString("hex")

    await PasswordReset.create({
        userId: user._id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    })

    const resetLink = `${process.env.BACKEND_URL}/resetpassword/${token}`

    const transporter = createTransporter()
    await transporter.sendMail({
        to: email,
        subject: "Reset your password",
        html: `
      <h3>Password Reset</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `
    })

    res.status(200).json({
        message: "Password reset link sent"
    })
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params
  const { password } = req.body

  if (!password) {
    throw new ApiError(400, "Password required")
  }

  const reset = await PasswordReset.findOne({
    token,
    expiresAt: { $gt: new Date() }
  })

  if (!reset) {
    throw new ApiError(400, "Invalid or expired token")
  }

  const user = await User.findById(reset.userId)
  if (!user) {
    throw new ApiError(400, "User not found")
  }

  user.password = password
  await user.save()

  await PasswordReset.deleteMany({ userId: user._id })

  res.status(200).json({
    message: "Password reset successful"
  })
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new ApiError(400, "Please Fill All Fields ...")
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        throw new ApiError(404, 'Invalid Credentials')
    }

    const isValid = await user.comparePassword(password)

    if (!isValid) {
        throw new ApiError(401, 'Invalid Credentials')
    }

    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in")
    }

    const accessToken = user.createAccessToken()
    const refreshToken = user.createRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000
        })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
            message: "Logged In Successfully",
            user: {
                id: user._id,
                email: user.email
            }
        })

})

export const signUp = asyncHandler(async (req: Request, res: Response) => {
    const { firstname, lastname, email, password } = req.body

    if (!firstname || !lastname || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new ApiError(409, 'Email already in use')
    }

    const user = await User.insertOne({
        first_name: firstname,
        last_name: lastname,
        email,
        password,
        isVerified: false
    })

    if (!user) {
        throw new ApiError(400, "Problem while creating user")
    }

    const token = crypto.randomBytes(32).toString("hex");

    await Verification.create({
        userId: user._id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });


    const transporter = createTransporter();
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `
          <h3>Verify your email</h3>
          <a href="${process.env.BACKEND_URL}/api/verify/${token}">
            Verify Email
          </a>
        `
    })

    return res.status(201).json(
        {
            message: "User created successfully",
            user: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        }
    )
})

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing")
  }

  let decoded: any
  try {
    decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    )
  } catch {
    throw new ApiError(401, "Invalid refresh token")
  }

  const user = await User.findById(decoded._id)

  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token expired or reused")
  }

  const newAccessToken = user.createAccessToken()

  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict"
    })
    .json({ message: "Access token refreshed" })
})