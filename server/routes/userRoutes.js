
import express from "express";
import rateLimit from "express-rate-limit";

import { verifyToken } from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

const profileRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Authenticated profile access
router.get("/me", profileRateLimiter, verifyToken, getProfile);

// Update authenticated customer's profile
router.put("/me", profileRateLimiter, verifyToken, updateProfile);

export default router;
