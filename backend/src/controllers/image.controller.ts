import cloudinary from "../utils/cloudinary.js"
import { Image } from "../models/image.model.js"
import ApiError from "../utils/ApiError.js"
import { Request, Response } from "express"

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded")
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `users/${req.user._id}`
    })

    const image = await Image.create({
      user: req.user._id,
      url: result.secure_url,
      public_id: result.public_id
    })

    res.status(201).json(image)
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUserImages = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id.toString()

    const images = await Image.find({ user: userId }).sort({ createdAt: -1 })

    res.status(200).json(images)

  } catch (error) {
    console.error(error)
    throw new ApiError(500, "Failed to fetch images")
  }
}

export const deleteImageController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const image = await Image.findOne({ _id: id, user: req.user._id });
    if (!image) return res.status(404).json({ message: "Image not found or unauthorized" });

    await cloudinary.uploader.destroy(image.public_id);

    await Image.deleteOne({ _id: id });

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};