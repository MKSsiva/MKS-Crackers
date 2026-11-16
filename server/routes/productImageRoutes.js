
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

import { mutationLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public: view product images
router.get("/product/:productId", getImages);

// Admin: upload product image
router.post(
  "/product/:productId",
  verifyToken,
  requireAdmin,
  mutationLimiter,
  upload.single("image"),
  uploadProductImage
);

// Admin: set primary image
router.put(
  "/:productId/:imageId/primary",
  verifyToken,
  requireAdmin,
  mutationLimiter,
  makePrimaryImage
);

// Admin: delete product image
router.delete(
  "/:imageId",
  verifyToken,
  requireAdmin,
  mutationLimiter,
  removeProductImage
);

export default router;
