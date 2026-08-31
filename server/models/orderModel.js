import pool from "../config/db.js";

export const createOrder = async ({
  userId,
  addressId,
  orderNumber,
  subtotal,
  discountAmount,
  shippingAmount,
  totalAmount,
  paymentMethod,
  notes,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO orders
    (
      user_id,
      address_id,
      order_number,
      subtotal,
      discount_amount,
      shipping_amount,
      total_amount,
      payment_method,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      addressId,
      orderNumber,
      subtotal,
      discountAmount,
      shippingAmount,
      totalAmount,
      paymentMethod || null,
      notes || null,
    ]
  );

  return result.insertId;
};

export const createOrderItem = async ({
  orderId,
  productId,
  productName,
  sku,
  quantity,
  price,
  subtotal,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO order_items
    (
      order_id,
      product_id,
      product_name,
      sku,
      quantity,
      price,
      subtotal
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      orderId,
      productId,
      productName,
      sku,
      quantity,
      price,
      subtotal,
    ]
  );

  return result.insertId;
};

export const getOrdersByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      order_number,
      subtotal,
      discount_amount,
      shipping_amount,
      total_amount,
      status,
      payment_status,
      payment_method,
      created_at,
      updated_at
    FROM orders
    WHERE user_id = ?
    ORDER BY id DESC
    `,
    [userId]
  );

  return rows;
};

export const getOrderById = async (orderId, userId) => {
  const [orders] = await pool.query(
    `
    SELECT
      id,
      user_id,
      address_id,
      order_number,
      subtotal,
      discount_amount,
      shipping_amount,
      total_amount,
      status,
      payment_status,
      payment_method,
      notes,
      created_at,
      updated_at
    FROM orders
    WHERE id = ? AND user_id = ?
    LIMIT 1
    `,
    [orderId, userId]
  );

  if (orders.length === 0) {
    return null;
  }

  const [items] = await pool.query(
    `
    SELECT
      id,
      product_id,
      product_name,
      sku,
      quantity,
      price,
      subtotal
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
    `,
    [orderId]
  );

  return {
    ...orders[0],
    items,
  };
};

export const cancelOrder = async (orderId, userId) => {
  const [result] = await pool.query(
    `
    UPDATE orders
    SET status = 'cancelled'
    WHERE id = ?
      AND user_id = ?
      AND status IN ('pending', 'confirmed')
    `,
    [orderId, userId]
  );

  return result.affectedRows;
};