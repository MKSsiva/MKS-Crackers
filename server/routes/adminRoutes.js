import express from "express";
import { authLimiter } from "../middleware/rateLimiters.js";
import {
  adminLogin,changeAdminPassword,
} from "../controllers/adminController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", authLimiter, adminLogin);

// Change admin password
router.put(
  "/change-password",
  verifyToken,
  requireAdmin,
  changeAdminPassword
);

// Protected admin test
router.get(
  "/test",
  verifyToken,
  requireAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Admin route working",
      user: req.user,
    });
  }
);

export default router;
