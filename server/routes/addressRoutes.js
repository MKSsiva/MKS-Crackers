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

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Address routes working",
  });
});

router.use(verifyToken);

router.post("/", addAddress);

router.get("/", getMyAddresses);

router.get("/:id", getSingleAddress);

router.put("/:id", editAddress);

router.delete("/:id", removeAddress);

router.put("/:id/default", makeDefaultAddress);

export default router;