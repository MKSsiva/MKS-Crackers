import express from "express";

import {
  getAdminHomepageFeatures,
  getAdminHomepageFeature,
  createAdminHomepageFeature,
  updateAdminHomepageFeature,
  deleteAdminHomepageFeature,
} from "../controllers/homepageController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin homepage routes require authentication
router.use(verifyToken);
router.use(requireAdmin);


// Get all features
router.get(
  "/features",
  getAdminHomepageFeatures
);


// Get single feature
router.get(
  "/features/:id",
  getAdminHomepageFeature
);


// Create feature
router.post(
  "/features",
  createAdminHomepageFeature
);


// Update feature
router.put(
  "/features/:id",
  updateAdminHomepageFeature
);


// Delete feature
router.delete(
  "/features/:id",
  deleteAdminHomepageFeature
);

export default router;