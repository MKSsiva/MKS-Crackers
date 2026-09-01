import express from "express";
import { getHomepageFeatures } from "../controllers/homepageController.js";

const router = express.Router();

router.get("/features", getHomepageFeatures);

export default router;