import express from "express";

import {
  getHomepageHero,
  getAdminHomepageHero,
  updateHomepageHero,
} from "../controllers/homepageHeroController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer homepage
router.get("/hero", getHomepageHero);

// Admin
router.get(
  "/admin/hero",
  verifyToken,
  requireAdmin,
  getAdminHomepageHero
);

router.put(
  "/admin/hero",
  verifyToken,
  requireAdmin,
  updateHomepageHero
);

export default router;