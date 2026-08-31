import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", verifyToken, getProfile);

export default router;