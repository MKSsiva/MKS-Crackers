import pool from "../config/db.js";

import {
  createOrder,
  createOrderItem,
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
} from "../models/orderModel.js";

export const checkout = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;

    const {
      address_id,
      payment_method,
      notes,
    } = req.body;

    if (!address_id) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    /*
     * Verify address belongs to logged-in user
     */
    const [addresses] = await connection.query(
      `
      SELECT id
      FROM addresses
      WHERE id = ? AND user_id = ?
      LIMIT 1
      `,
      [address_id, userId]
    );

    if (addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    /*
     * Get cart items
     */
    const [cartItems] = await connection.query(
      `
      SELECT
        c.id AS cart_id,
        c.product_id,
        c.quantity,

        p.name,
        p.sku,
        p.price,
        p.sale_price,
        p.stock_quantity,
        p.status

      FROM cart c

      INNER JOIN products p
        ON p.id = c.product_id

      WHERE c.user_id = ?
      `,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    /*
     * Check stock
     */
    for (const item of cartItems) {
      if (item.status !== "active") {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name}" is not available`,
        });
      }

      if (item.stock_quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.name}"`,
        });
      }
    }

    /*
     * Calculate subtotal
     */
    let subtotal = 0;

    const preparedItems = cartItems.map((item) => {
      const price =
        item.sale_price !== null
          ? Number(item.sale_price)
          : Number(item.price);

      const itemSubtotal =
        price * Number(item.quantity);

      subtotal += itemSubtotal;

      return {
        productId: item.product_id,
        productName: item.name,
        sku: item.sku,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
      };
    });

    /*
     * For now:
     * discount = 0
     * shipping = 0
     */
    const discountAmount = 0;
    const shippingAmount = 0;

    const totalAmount =
      subtotal -
      discountAmount +
      shippingAmount;

    /*
     * Generate order number
     */
    const orderNumber =
      `MKS-${Date.now()}-${userId}`;

    /*
     * Start transaction
     */
    await connection.beginTransaction();

    /*
     * Create order
     */
    const [orderResult] = await connection.query(
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
        address_id,
        orderNumber,
        subtotal,
        discountAmount,
        shippingAmount,
        totalAmount,
        payment_method || null,
        notes || null,
      ]
    );

    const orderId = orderResult.insertId;

    /*
     * Create order items
     * and reduce stock
     */
    for (const item of preparedItems) {
      await connection.query(
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
          item.productId,
          item.productName,
          item.sku,
          item.quantity,
          item.price,
          item.subtotal,
        ]
      );

      const [stockResult] = await connection.query(
        `
        UPDATE products
        SET stock_quantity =
            stock_quantity - ?
        WHERE id = ?
          AND stock_quantity >= ?
        `,
        [
          item.quantity,
          item.productId,
          item.quantity,
        ]
      );

      if (stockResult.affectedRows === 0) {
        throw new Error(
          `Stock changed for "${item.productName}". Please try again.`
        );
      }
    }

    /*
     * Clear cart
     */
    await connection.query(
      `
      DELETE FROM cart
      WHERE user_id = ?
      `,
      [userId]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: orderId,
        order_number: orderNumber,
        subtotal,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        payment_method: payment_method || null,
        status: "pending",
        payment_status: "pending",
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    connection.release();
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await getOrdersByUserId(
      req.user.id
    );

    return res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await getOrderById(
      id,
      req.user.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const cancelled = await cancelOrder(
      id,
      req.user.id
    );

    if (!cancelled) {
      return res.status(400).json({
        success: false,
        message:
          "Order cannot be cancelled or order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};