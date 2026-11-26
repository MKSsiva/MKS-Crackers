import express from "express";
import rateLimit from "express-rate-limit";

import {
  getAllOrders,
  getAdminOrderDetails,
  updateOrderStatus,
} from "../controllers/adminOrderController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOrderRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(adminOrderRateLimiter);

// All admin order operations require admin authentication.
router.use(verifyToken, requireAdmin);

router.get("/", getAllOrders);

router.get("/:id", getAdminOrderDetails);

router.put("/:id/status", updateOrderStatus);

export default router;
