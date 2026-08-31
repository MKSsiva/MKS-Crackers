import express from "express";

import {
  uploadProductImage,
  getImages,
  makePrimaryImage,
  removeProductImage,
} from "../controllers/productImageController.js";

import upload from "../middleware/uploadMiddleware.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Get product images
router.get(
  "/product/:productId",
  getImages
);

// Admin upload
router.post(
  "/product/:productId",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  uploadProductImage
);

// Admin set primary image
router.put(
  "/:productId/:imageId/primary",
  verifyToken,
  requireAdmin,
  makePrimaryImage
);

// Admin delete image
router.delete(
  "/:imageId",
  verifyToken,
  requireAdmin,
  removeProductImage
);

export default router;