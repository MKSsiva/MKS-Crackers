import pool from "../config/db.js";
import { findUserById } from "../models/userModel.js";

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let { name, phone } = req.body;

    name = typeof name === "string" ? name.trim() : "";
    phone = typeof phone === "string" ? phone.trim() : "";

    if (!name || name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must contain between 2 and 100 characters.",
      });
    }

    // const phoneDigits = phone.replace(/\D/g, "");

    if (!/^\+91[6-9]\d{9}$/.test(phone)) {
  return res.status(400).json({
    success: false,
    message: "Enter a valid Indian mobile number in +91XXXXXXXXXX format.",
  });
}

    await pool.query(
      "UPDATE users SET name = ?, phone = ? WHERE id = ?",
      [name, phone, userId]
    );

    const [rows] = await pool.query(
      `SELECT id, name, email, phone, role, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: rows[0],
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile. Please try again.",
    });
  }
};
