import express from "express";

import {
  checkout,
  getMyOrders,
  getSingleOrder,
  cancelMyOrder,
} from "../controllers/orderController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Order routes working",
  });
});

router.use(verifyToken);

router.post("/checkout", checkout);

router.get("/", getMyOrders);

router.get("/:id", getSingleOrder);

router.put("/:id/cancel", cancelMyOrder);

export default router;