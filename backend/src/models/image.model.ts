import mongoose, { Document } from "mongoose"

export interface IImage extends Document {
    user: mongoose.Types.ObjectId;
    url: string;
    public_id: string;
}

const imageSchema = new mongoose.Schema<IImage>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

export const Image = mongoose.model("Image", imageSchema)