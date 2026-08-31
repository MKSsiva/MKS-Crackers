import pool from "../config/db.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check product
    const [products] = await pool.query(
      `SELECT id, name, status
       FROM products
       WHERE id = ?
       LIMIT 1`,
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check existing wishlist item
    const [existing] = await pool.query(
      `SELECT id
       FROM wishlist
       WHERE user_id = ? AND product_id = ?
       LIMIT 1`,
      [userId, product_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in wishlist",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO wishlist
       (user_id, product_id)
       VALUES (?, ?)`,
      [userId, product_id]
    );

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist_id: result.insertId,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
};


// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const [items] = await pool.query(
      `SELECT
          w.id,
          w.product_id,
          p.name,
          p.slug,
          p.sku,
          p.price,
          p.sale_price,
          p.stock_quantity,
          p.status,
          w.created_at
       FROM wishlist w
       INNER JOIN products p
         ON p.id = w.product_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      items,
      count: items.length,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};


// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.product_id;

    const [result] = await pool.query(
      `DELETE FROM wishlist
       WHERE user_id = ? AND product_id = ?`,
      [userId, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    return res.json({
      success: true,
      message: "Product removed from wishlist",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove wishlist item",
    });
  }
};


// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM wishlist
       WHERE user_id = ?`,
      [userId]
    );

    return res.json({
      success: true,
      message: "Wishlist cleared successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
    });
  }
};