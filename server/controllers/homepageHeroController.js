import pool from "../config/db.js";

export const getHomepageHero = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        badge,
        title,
        subtitle,
        primary_button_text,
        primary_button_link,
        secondary_button_text,
        secondary_button_link,
        image,
        status
      FROM homepage_hero
      WHERE status = 'active'
      ORDER BY id ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      hero: rows[0] || null,
    });
  } catch (error) {
    console.error("Homepage hero error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load homepage hero",
    });
  }
};

export const getAdminHomepageHero = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        id,
        badge,
        title,
        subtitle,
        primary_button_text,
        primary_button_link,
        secondary_button_text,
        secondary_button_link,
        image,
        status,
        created_at,
        updated_at
      FROM homepage_hero
      ORDER BY id ASC
      LIMIT 1
    `);

    res.json({
      success: true,
      hero: rows[0] || null,
    });
  } catch (error) {
    console.error(
      "Admin homepage hero error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load homepage hero",
    });
  }
};

export const updateHomepageHero = async (req, res) => {
  try {
    const {
      badge,
      title,
      subtitle,
      primary_button_text,
      primary_button_link,
      secondary_button_text,
      secondary_button_link,
      image,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Hero title is required",
      });
    }

    const [existingRows] = await pool.query(
      "SELECT id FROM homepage_hero ORDER BY id ASC LIMIT 1"
    );

    if (existingRows.length === 0) {
      const [result] = await pool.query(
        `
        INSERT INTO homepage_hero (
          badge,
          title,
          subtitle,
          primary_button_text,
          primary_button_link,
          secondary_button_text,
          secondary_button_link,
          image,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          badge || null,
          title,
          subtitle || null,
          primary_button_text || null,
          primary_button_link || null,
          secondary_button_text || null,
          secondary_button_link || null,
          image || null,
          status || "active",
        ]
      );

      return res.json({
        success: true,
        message: "Homepage hero created successfully",
        id: result.insertId,
      });
    }

    const heroId = existingRows[0].id;

    await pool.query(
      `
      UPDATE homepage_hero
      SET
        badge = ?,
        title = ?,
        subtitle = ?,
        primary_button_text = ?,
        primary_button_link = ?,
        secondary_button_text = ?,
        secondary_button_link = ?,
        image = ?,
        status = ?
      WHERE id = ?
      `,
      [
        badge || null,
        title,
        subtitle || null,
        primary_button_text || null,
        primary_button_link || null,
        secondary_button_text || null,
        secondary_button_link || null,
        image || null,
        status || "active",
        heroId,
      ]
    );

    res.json({
      success: true,
      message: "Homepage hero updated successfully",
    });
  } catch (error) {
    console.error(
      "Update homepage hero error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update homepage hero",
    });
  }
};