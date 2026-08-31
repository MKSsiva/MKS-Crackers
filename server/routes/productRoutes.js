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

const router = express.Router();

// Public
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", verifyToken, requireAdmin, create);
router.put("/:id", verifyToken, requireAdmin, update);
router.delete("/:id", verifyToken, requireAdmin, remove);

export default router;