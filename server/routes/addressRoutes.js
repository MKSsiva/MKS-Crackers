
import express from "express";

import {
  addAddress,
  getMyAddresses,
  getSingleAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
} from "../controllers/addressController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { mutationLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Address routes working",
  });
});

// All address operations below require authentication
router.use(verifyToken);

// Add address
router.post("/", mutationLimiter, addAddress);

// Get logged-in user's addresses
router.get("/", getMyAddresses);

// Get a single address
router.get("/:id", getSingleAddress);

// Update address
router.put("/:id", mutationLimiter, editAddress);

// Delete address
router.delete("/:id", mutationLimiter, removeAddress);

// Set default address
router.put("/:id/default", mutationLimiter, makeDefaultAddress);

export default router;
