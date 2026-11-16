
import express from "express";

import {
  listCategories,
  showCategory,
  storeCategory,
  editCategory,
  removeCategory,
} from "../controllers/categoryController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

import { mutationLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public
router.get("/", listCategories);
router.get("/:id", showCategory);

// Admin only — rate-limited write operations
router.post("/", verifyToken, requireAdmin, mutationLimiter, storeCategory);
router.put("/:id", verifyToken, requireAdmin, mutationLimiter, editCategory);
router.delete("/:id", verifyToken, requireAdmin, mutationLimiter, removeCategory);

export default router;
