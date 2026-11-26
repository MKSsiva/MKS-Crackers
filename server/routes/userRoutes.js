
import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

// Authenticated profile access
router.get("/me", verifyToken, getProfile);

// Update authenticated customer's profile
router.put("/me", verifyToken, updateProfile);

export default router;
