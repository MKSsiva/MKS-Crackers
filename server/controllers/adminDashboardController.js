import pool from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [[products]] = await pool.query(
      "SELECT COUNT(*) AS total FROM products"
    );

    const [[categories]] = await pool.query(
      "SELECT COUNT(*) AS total FROM categories"
    );

    const [[orders]] = await pool.query(
      "SELECT COUNT(*) AS total FROM orders"
    );

    const [[customers]] = await pool.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'customer'"
    );

    res.json({
      success: true,
      stats: {
        products: products.total,
        categories: categories.total,
        orders: orders.total,
        customers: customers.total,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};