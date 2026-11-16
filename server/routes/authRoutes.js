import express from "express";
import { register, login } from "../controllers/authController.js";
import { authLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

// Limit repeated registration attempts
router.post("/register", authLimiter, register);

// Limit repeated login attempts
router.post("/login", authLimiter, login);

export default router;