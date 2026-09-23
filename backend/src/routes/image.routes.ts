import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import { deleteImageController, uploadImage } from "../controllers/image.controller.js"
import { getUserImages } from "../controllers/image.controller.js"

const Imagerouter = Router()

Imagerouter.route('/upload').post(verifyJWT, upload.single('image'), uploadImage)
Imagerouter.route("/my-images").get(verifyJWT, getUserImages)
Imagerouter.route('/:id').delete(verifyJWT, deleteImageController)

export default Imagerouter