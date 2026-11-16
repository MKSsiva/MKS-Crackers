
import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { mutationLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// All wishlist operations require customer authentication
router.use(verifyToken);

// Add product to wishlist
router.post("/", mutationLimiter, addToWishlist);

// View wishlist
router.get("/", getWishlist);

// Remove product from wishlist
router.delete("/:product_id", mutationLimiter, removeFromWishlist);

// Clear wishlist
router.delete("/", mutationLimiter, clearWishlist);

export default router;
