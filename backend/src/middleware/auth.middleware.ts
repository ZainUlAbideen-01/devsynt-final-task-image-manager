import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken
        if (!token) {
            throw new ApiError(401, 'Unauthorized User')
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload

        const user = await User.findById(decoded._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user
        next()

    } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})