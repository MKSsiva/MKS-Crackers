import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const [rows] = await pool.query(
      `SELECT *
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = rows[0];

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Check account status
    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Update last login
    await pool.query(
      `UPDATE users
       SET last_login_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [user.id]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
