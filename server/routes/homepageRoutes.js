import express from "express";

import {
  getPublicHomepageFeatures,
} from "../controllers/homepageController.js";

const router = express.Router();

// Public homepage features
router.get(
  "/features",
  getPublicHomepageFeatures
);

export default router;