import express from "express";
import { sensitiveActionLimiter } from "../middleware/rateLimiters.js";

import {
  submitUpiPayment,
  getPayment,
  getMyPayments,
  getOrderPayment,
  getAdminPendingPayments,
  getAdminAllPayments,
  getAdminPayment,
  verifyUpiPayment,
} from "../controllers/paymentController.js";

import {
  verifyToken,
  requireAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// ALL PAYMENT ROUTES REQUIRE LOGIN
// =====================================================

router.use(verifyToken);

// =====================================================
// CUSTOMER PAYMENT ROUTES
// =====================================================

// Submit UPI payment / UTR
router.post("/upi/submit", sensitiveActionLimiter,submitUpiPayment);

// Get logged-in user's payments
router.get("/my", getMyPayments);

// Get payment for an order
router.get("/order/:orderId", getOrderPayment);

// =====================================================
// ADMIN PAYMENT ROUTES
// =====================================================

// Pending / processing UPI payments
router.get(
  "/admin/pending",
  requireAdmin,
  getAdminPendingPayments
);

// All UPI payments
router.get(
  "/admin/all",
  requireAdmin,
  getAdminAllPayments
);

// Single payment
router.get(
  "/admin/:id",
  requireAdmin,
  getAdminPayment
);

// Approve / reject UPI payment
router.put(
  "/admin/:id/verify",
  requireAdmin,
  sensitiveActionLimiter,
  verifyUpiPayment
);

// =====================================================
// GENERIC PAYMENT BY ID
// Keep this AFTER /admin routes
// =====================================================

router.get("/:id", getPayment);

export default router;