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

const router = express.Router();

// Public
router.get("/", listCategories);
router.get("/:id", showCategory);

// Admin only
router.post(
  "/",
  verifyToken,
  requireAdmin,
  storeCategory
);

router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  editCategory
);

router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  removeCategory
);

export default router;