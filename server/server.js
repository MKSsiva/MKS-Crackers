import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

import homepageRoutes from "./routes/homepageRoutes.js";
import homepageHeroRoutes from "./routes/homepageHeroRoutes.js";
import homepagePromoRoutes from "./routes/homepagePromoRoutes.js";
import adminHomepageRoutes from "./routes/adminHomepageRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import productImageRoutes from "./routes/productImageRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";



dotenv.config();

const app = express();

// ==========================================
// GLOBAL API RATE LIMITING
// ==========================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Apply rate limiting to all API endpoints
app.use("/api", apiLimiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Welcome to MKS Crackers API",
  });
});

// Database test
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");

    res.json({
      success: true,
      database: "Connected",
      serverTime: rows[0].time,
    });
  } catch (err) {
    console.error("Database error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Authentication
app.use("/api/auth", authRoutes);

app.use("/api/payments", paymentRoutes); // payment

// User
app.use("/api/users", userRoutes);

// Admin
app.use("/api/admin", adminRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes); // adminDashboard

app.use("/api/categories", categoryRoutes); // Category
app.use("/api/products", productRoutes); // product
app.use("/api/product-images", productImageRoutes); // productImage
app.use("/api/cart", cartRoutes); // cart
app.use("/api/wishlist", wishlistRoutes); //wishlist
app.use("/api/addresses", addressRoutes); //address
app.use("/api/orders", orderRoutes); //order
app.use("/api/homepage", homepageRoutes); //homepage
app.use("/api/homepage", homepageHeroRoutes); // homepageHero
app.use("/api/homepage", homepagePromoRoutes); // homepagePromo
app.use("/api/admin/homepage", adminHomepageRoutes); // adminHomepage


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});