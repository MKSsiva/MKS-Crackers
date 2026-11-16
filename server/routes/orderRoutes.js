
import express from "express";

import {
  checkout,
  getMyOrders,
  getSingleOrder,
  cancelMyOrder,
} from "../controllers/orderController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { sensitiveActionLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public route test
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes working",
  });
});

// All customer order operations require authentication
router.use(verifyToken);

// Checkout: sensitive operation
router.post("/checkout", sensitiveActionLimiter, checkout);

// View orders
router.get("/", getMyOrders);

router.get("/:id", getSingleOrder);

// Cancel order
router.put("/:id/cancel", sensitiveActionLimiter, cancelMyOrder);

export default router;
