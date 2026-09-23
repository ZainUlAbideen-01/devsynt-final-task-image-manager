import dotenv from "dotenv"
dotenv.config()
import { ConnectDB } from "./src/Database/database.js"
import { Image } from "./src/models/image.model.js"
import cloudinary from "./src/utils/cloudinary.js"

const cleanup = async () => {
    try {
        await ConnectDB();
        console.log("Connected to DB, checking for ghost images...");

        // Get all images from DB
        const dbImages = await Image.find();
        let deletedCount = 0;

        for (const img of dbImages) {
            try {
                // Try to get resource from cloudinary
                await cloudinary.api.resource(img.public_id);
            } catch (error: any) {
                console.log(`Error checking image ${img.public_id}:`, error.message || error);
                if (error?.http_code === 404 || error?.error?.http_code === 404) {
                    console.log(`Image not found in Cloudinary. Deleting from DB: ${img.public_id}`);
                    await Image.deleteOne({ _id: img._id });
                    deletedCount++;
                }
            }
        }

        console.log(`Cleanup complete! Deleted ${deletedCount} ghost images from the database.`);
        process.exit(0);
    } catch (err) {
        console.error("Cleanup failed:", err);
        process.exit(1);
    }
}

cleanup();
