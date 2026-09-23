import mongoose, { Document } from "mongoose";

export interface IVerification extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const verificationSchema = new mongoose.Schema<IVerification>({
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
});

export const Verification = mongoose.model(
  "Verification",
  verificationSchema
);