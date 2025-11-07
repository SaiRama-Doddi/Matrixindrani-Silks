import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "sarees",
    resource_type: "image",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: file.originalname.split(".")[0] + "-" + Date.now(),
  }),
});

const upload = multer({ storage });

export default upload;
