import mongoose, { Document } from "mongoose"

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const passwordResetSchema = new mongoose.Schema<IPasswordReset>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
})

export const PasswordReset = mongoose.model("PasswordReset", passwordResetSchema)