import pool from "../config/db.js";

// =====================================================
// CUSTOMER — GET ACTIVE PROMO BANNER
// =====================================================

export const getHomepagePromo = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        subtitle,
        offer_text,
        coupon_code,
        discount,
        button_text,
        button_link,
        image,
        status
      FROM homepage_promo_banners
      WHERE status = 'active'
      ORDER BY sort_order ASC, id ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      promo: rows[0] || null,
    });
  } catch (error) {
    console.error(
      "Homepage promo error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load homepage promo banner",
    });
  }
};

// =====================================================
// ADMIN — GET PROMO BANNER
// =====================================================

export const getAdminHomepagePromo = async (
  req,
  res
) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        title,
        subtitle,
        offer_text,
        coupon_code,
        discount,
        button_text,
        button_link,
        image,
        status,
        sort_order,
        created_at,
        updated_at
      FROM homepage_promo_banners
      ORDER BY sort_order ASC, id ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      promo: rows[0] || null,
    });
  } catch (error) {
    console.error(
      "Admin homepage promo error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load homepage promo banner",
    });
  }
};

// =====================================================
// ADMIN — CREATE / UPDATE PROMO BANNER
// =====================================================

export const updateHomepagePromo = async (
  req,
  res
) => {
  try {
    const {
      title,
      subtitle,
      offer_text,
      coupon_code,
      discount,
      button_text,
      button_link,
      image,
      status,
      sort_order,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Promo banner title is required",
      });
    }

    const [existingRows] = await pool.query(
      `
      SELECT id
      FROM homepage_promo_banners
      ORDER BY sort_order ASC, id ASC
      LIMIT 1
      `
    );

    // =================================================
    // CREATE
    // =================================================

    if (existingRows.length === 0) {
      const [result] = await pool.query(
        `
        INSERT INTO homepage_promo_banners (
          title,
          subtitle,
          offer_text,
          coupon_code,
          discount,
          button_text,
          button_link,
          image,
          status,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          title,
          subtitle || null,
          offer_text || null,
          coupon_code || null,
          discount || 0,
          button_text || null,
          button_link || null,
          image || null,
          status || "active",
          sort_order || 0,
        ]
      );

      return res.json({
        success: true,
        message:
          "Homepage promo banner created successfully",
        id: result.insertId,
      });
    }

    // =================================================
    // UPDATE
    // =================================================

    const promoId = existingRows[0].id;

    await pool.query(
      `
      UPDATE homepage_promo_banners
      SET
        title = ?,
        subtitle = ?,
        offer_text = ?,
        coupon_code = ?,
        discount = ?,
        button_text = ?,
        button_link = ?,
        image = ?,
        status = ?,
        sort_order = ?
      WHERE id = ?
      `,
      [
        title,
        subtitle || null,
        offer_text || null,
        coupon_code || null,
        discount || 0,
        button_text || null,
        button_link || null,
        image || null,
        status || "active",
        sort_order || 0,
        promoId,
      ]
    );

    res.json({
      success: true,
      message:
        "Homepage promo banner updated successfully",
    });
  } catch (error) {
    console.error(
      "Update homepage promo error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update homepage promo banner",
    });
  }
};