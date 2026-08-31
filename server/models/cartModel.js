import pool from "../config/db.js";

export const findCartItem = async (userId, productId) => {
  const [rows] = await pool.query(
    `SELECT *
     FROM cart
     WHERE user_id = ? AND product_id = ?
     LIMIT 1`,
    [userId, productId]
  );

  return rows[0];
};

export const addCartItem = async (userId, productId, quantity) => {
  const [result] = await pool.query(
    `INSERT INTO cart
      (user_id, product_id, quantity)
     VALUES (?, ?, ?)`,
    [userId, productId, quantity]
  );

  return result.insertId;
};

export const updateCartQuantity = async (cartId, userId, quantity) => {
  await pool.query(
    `UPDATE cart
     SET quantity = ?
     WHERE id = ? AND user_id = ?`,
    [quantity, cartId, userId]
  );
};

export const deleteCartItem = async (cartId, userId) => {
  await pool.query(
    `DELETE FROM cart
     WHERE id = ? AND user_id = ?`,
    [cartId, userId]
  );
};

export const clearUserCart = async (userId) => {
  await pool.query(
    `DELETE FROM cart
     WHERE user_id = ?`,
    [userId]
  );
};

export const getUserCart = async (userId) => {
  const [rows] = await pool.query(
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
        p.status
     FROM cart c
     INNER JOIN products p
       ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC`,
    [userId]
  );

  return rows;
};