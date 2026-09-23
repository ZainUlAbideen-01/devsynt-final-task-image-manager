import { Router, Request, Response } from "express"
import { forgotPassword, loginUser, refreshAccessToken, resetPassword, signUp } from "../controllers/user.controller.js"
import { Verification } from "../models/verification.model.js"
import { User } from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const router = Router()

router.route('/login').post(loginUser)
router.route('/signup').post(signUp)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').post(resetPassword)
router.route('/refresh-token').post(refreshAccessToken)

router.route('/verify/:token').get(asyncHandler(async (req: Request, res: Response) => {
    const record = await Verification.findOne({ token: req.params.token });

    if (!record || record.expiresAt.getTime() < Date.now()) {
        throw new ApiError(400, "Invalid or expired verification link");
    }

    await User.findByIdAndUpdate(record.userId, {
        isVerified: true,
        verifiedAt: new Date()
    });

    await Verification.deleteOne({ token: req.params.token });

    res.redirect(process.env.FRONTEND_URL || "http://localhost:5173/");
}))

export default router