import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export interface IUser extends Document {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    verifiedAt?: Date;
    refreshToken?: string;
    createAccessToken(): string;
    createRefreshToken(): string;
    comparePassword(pass: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date
    },
    refreshToken: {
        type: String
    }
})

userSchema.pre('save', async function () {

    if (!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password as string, 10)
})

userSchema.methods.createAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any
        }
    )
}

userSchema.methods.createRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any
        }
    )
}

userSchema.methods.comparePassword = async function(pass: string) {
    return await bcrypt.compare(pass, this.password as string)
}

export const User = mongoose.model('User', userSchema)