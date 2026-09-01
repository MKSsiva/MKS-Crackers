import pool from "../config/db.js";

export const getHomepageFeatures = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        icon,
        title,
        description,
        sort_order,
        status
      FROM homepage_features
      WHERE status = 'active'
      ORDER BY sort_order ASC
    `);

    res.json({
      success: true,
      features: rows
    });
  } catch (error) {
    console.error("Homepage features error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load homepage features"
    });
  }
};