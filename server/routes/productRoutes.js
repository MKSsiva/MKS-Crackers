
import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/productController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

import { mutationLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only — rate-limited write operations
router.post("/", verifyToken, requireAdmin, mutationLimiter, create);
router.put("/:id", verifyToken, requireAdmin, mutationLimiter, update);
router.delete("/:id", verifyToken, requireAdmin, mutationLimiter, remove);

export default router;
