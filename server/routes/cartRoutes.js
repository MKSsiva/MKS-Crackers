
import express from "express";

import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { mutationLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// All cart operations require customer authentication
router.use(verifyToken);

// Add product to cart
router.post("/", mutationLimiter, addToCart);

// View cart
router.get("/", getCart);

// Update cart quantity
router.put("/:id", mutationLimiter, updateCart);

// Remove item from cart
router.delete("/:id", mutationLimiter, removeFromCart);

// Clear cart
router.delete("/", mutationLimiter, clearCart);

export default router;
