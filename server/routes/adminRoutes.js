import express from "express";
import {
  adminLogin,
} from "../controllers/adminController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

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