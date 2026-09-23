import { Router, Request, Response } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";

const authRouter = Router()

authRouter.route('/me').get(verifyJWT, (req: Request, res: Response) => {
    res.status(200).json({
        user: req.user
    })
})

authRouter.route('/logout').post(verifyJWT, async (req: Request, res: Response) => {

    await User.findByIdAndUpdate(req.user._id, {
        refreshToken: null
    })

    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    })
        .clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        })
        .status(200)
        .json({
            message: 'Logged out successfully'
        })
})

export default authRouter