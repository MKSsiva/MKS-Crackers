import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer authentication required
router.use(verifyToken);

router.post("/", addToCart);

router.get("/", getCart);

router.put("/:id", updateCart);

router.delete("/:id", removeFromCart);

router.delete("/", clearCart);

export default router;