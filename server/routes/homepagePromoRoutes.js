import express from "express";

import {
  getHomepagePromo,
  getAdminHomepagePromo,
  updateHomepagePromo,
} from "../controllers/homepagePromoController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// CUSTOMER
// =====================================================

router.get(
  "/promo",
  getHomepagePromo
);

// =====================================================
// ADMIN
// =====================================================

router.get(
  "/admin/promo",
  verifyToken,
  requireAdmin,
  getAdminHomepagePromo
);

router.put(
  "/admin/promo",
  verifyToken,
  requireAdmin,
  updateHomepagePromo
);

export default router;