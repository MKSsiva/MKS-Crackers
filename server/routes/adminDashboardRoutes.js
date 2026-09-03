import express from "express";

import {
  getDashboardStats,
} from "../controllers/adminDashboardController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  verifyToken,
  requireAdmin,
  getDashboardStats
);

export default router;