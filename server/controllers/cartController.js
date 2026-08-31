import pool from "../config/db.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // Check product
    const [products] = await pool.query(
      `SELECT id, name, price, sale_price, stock_quantity, status
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

    const product = products[0];

    if (product.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Check existing cart item
    const [existing] = await pool.query(
      `SELECT id, quantity
       FROM cart
       WHERE user_id = ? AND product_id = ?
       LIMIT 1`,
      [userId, product_id]
    );

    if (existing.length > 0) {
      const newQuantity = existing[0].quantity + Number(quantity);

      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({
          success: false,
          message: "Requested quantity exceeds available stock",
        });
      }

      await pool.query(
        `UPDATE cart
         SET quantity = ?
         WHERE id = ? AND user_id = ?`,
        [newQuantity, existing[0].id, userId]
      );

      return res.json({
        success: true,
        message: "Cart quantity updated",
        cart_id: existing[0].id,
        quantity: newQuantity,
      });
    }

    const [result] = await pool.query(
      `INSERT INTO cart
        (user_id, product_id, quantity)
       VALUES (?, ?, ?)`,
      [userId, product_id, quantity]
    );

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      cart_id: result.insertId,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const [items] = await pool.query(
      `SELECT
          c.id,
          c.product_id,
          c.quantity,
          p.name,
          p.slug,
          p.sku,
          p.price,
          p.sale_price,
          p.stock_quantity,
          p.status,
          (
            COALESCE(p.sale_price, p.price) * c.quantity
          ) AS item_total
       FROM cart c
       INNER JOIN products p
         ON p.id = c.product_id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    const subtotal = items.reduce(
      (total, item) => total + Number(item.item_total),
      0
    );

    return res.json({
      success: true,
      items,
      subtotal: Number(subtotal.toFixed(2)),
      item_count: items.length,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const [cartItems] = await pool.query(
      `SELECT c.id, c.product_id, p.stock_quantity
       FROM cart c
       INNER JOIN products p
         ON p.id = c.product_id
       WHERE c.id = ? AND c.user_id = ?
       LIMIT 1`,
      [cartId, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (quantity > cartItems[0].stock_quantity) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }

    await pool.query(
      `UPDATE cart
       SET quantity = ?
       WHERE id = ? AND user_id = ?`,
      [quantity, cartId, userId]
    );

    return res.json({
      success: true,
      message: "Cart updated successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartId = req.params.id;

    const [result] = await pool.query(
      `DELETE FROM cart
       WHERE id = ? AND user_id = ?`,
      [cartId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    return res.json({
      success: true,
      message: "Product removed from cart",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM cart WHERE user_id = ?`,
      [userId]
    );

    return res.json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};