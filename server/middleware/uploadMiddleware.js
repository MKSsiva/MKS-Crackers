import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "mks-crackers/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "image",
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, PNG and WEBP images are allowed"),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter,
});

export default upload;