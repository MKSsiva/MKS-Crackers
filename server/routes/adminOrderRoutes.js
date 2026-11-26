import express from "express";

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

// All admin order operations require admin authentication.
router.use(verifyToken, requireAdmin);

router.get("/", getAllOrders);

router.get("/:id", getAdminOrderDetails);

router.put("/:id/status", updateOrderStatus);

export default router;
