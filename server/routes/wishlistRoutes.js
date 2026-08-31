import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All wishlist operations require login
router.use(verifyToken);

router.post("/", addToWishlist);

router.get("/", getWishlist);

router.delete("/:product_id", removeFromWishlist);

router.delete("/", clearWishlist);

export default router;