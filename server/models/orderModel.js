
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

// Get all orders belonging to a customer,
// including their name and mobile number.
export const getOrdersByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      o.address_id,
      o.order_number,
      o.subtotal,
      o.discount_amount,
      o.shipping_amount,
      o.total_amount,
      o.status,
      o.payment_status,
      o.payment_method,
      o.notes,
      o.created_at,
      o.updated_at,

      u.name AS customer_name,
      u.phone AS customer_phone

    FROM orders o

    INNER JOIN users u
      ON u.id = o.user_id

    WHERE o.user_id = ?

    ORDER BY o.created_at DESC, o.id DESC
    `,
    [userId]
  );

  return rows;
};

// Get one order with its ordered products
// and delivery address.
export const getOrderById = async (orderId, userId) => {
  const [orders] = await pool.query(
    `
    SELECT
      o.id,
      o.user_id,
      o.address_id,
      o.order_number,
      o.subtotal,
      o.discount_amount,
      o.shipping_amount,
      o.total_amount,
      o.status,
      o.payment_status,
      o.payment_method,
      o.notes,
      o.created_at,
      o.updated_at,

      u.name AS customer_name,
      u.phone AS customer_phone,

      a.name AS address_name,
      a.phone AS address_phone,
      a.address_line1,
      a.address_line2,
      a.city,
      a.state,
      a.pincode,
      a.landmark,
      a.address_type

    FROM orders o

    INNER JOIN users u
      ON u.id = o.user_id

    LEFT JOIN addresses a
      ON a.id = o.address_id
      AND a.user_id = o.user_id

    WHERE o.id = ?
      AND o.user_id = ?

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
