
import pool from "../config/db.js";

import {
  sendOrderConfirmationEmail,
} from "../services/emailService.js";

// ==========================================
// CUSTOMER CHECKOUT
// ==========================================

export const checkout = async (req, res) => {
  let connection;
  let transactionStarted = false;

  try {
    connection = await pool.getConnection();

    const userId = req.user.id;

    const {
      address_id,
      payment_method,
      notes,
    } = req.body;

    // Validate address
    if (!address_id) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    // Get customer details for confirmation email
    const [users] = await connection.query(
      `SELECT name, email
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found",
      });
    }

    const customer = users[0];

    // Verify address belongs to logged-in user
    const [addresses] = await connection.query(
      `SELECT id
       FROM addresses
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [address_id, userId]
    );

    if (addresses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Get cart items
    const [cartItems] = await connection.query(
      `SELECT
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
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // Check product availability and stock
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

    // Calculate subtotal
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

    // Calculate order amounts
    const discountAmount = 0;
    const shippingAmount = 0;

    const totalAmount =
      subtotal - discountAmount + shippingAmount;

    // Generate order number
    const orderNumber =
      `MKS-${Date.now()}-${userId}`;

    // Start database transaction
    await connection.beginTransaction();
    transactionStarted = true;

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO orders
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    // Create order items and reduce stock
    for (const item of preparedItems) {
      await connection.query(
        `INSERT INTO order_items
         (
           order_id,
           product_id,
           product_name,
           sku,
           quantity,
           price,
           subtotal
         )
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
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
        `UPDATE products
         SET stock_quantity = stock_quantity - ?
         WHERE id = ?
           AND stock_quantity >= ?`,
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

    // Clear customer's cart
    await connection.query(
      `DELETE FROM cart
       WHERE user_id = ?`,
      [userId]
    );

    // Commit database transaction
    await connection.commit();
    transactionStarted = false;

    // ==========================================
    // SEND ORDER CONFIRMATION EMAIL
    // ==========================================

    let emailSent = false;

    if (customer.email) {
      try {
        await sendOrderConfirmationEmail({
          name: customer.name,
          email: customer.email,
          orderId: orderNumber,
          amount: totalAmount.toFixed(2),
        });

        emailSent = true;

        console.log(
          `Order confirmation email sent for ${orderNumber}`
        );

      } catch (emailError) {
        // Email failure must not undo a successful order
        console.error(
          `Order ${orderNumber} created, but confirmation email failed:`,
          emailError.message
        );
      }
    }

    // Send checkout response
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      email_sent: emailSent,
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
    if (connection && transactionStarted) {
      await connection.rollback();
    }

    console.error("Checkout error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to place order",
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// ==========================================
// GET CUSTOMER ORDERS
// ==========================================

export const getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT *
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders",
    });
  }
};

// ==========================================
// GET SINGLE CUSTOMER ORDER
// ==========================================

export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      `SELECT *
       FROM orders
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order: orders[0],
    });

  } catch (error) {
    console.error("Get single order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve order",
    });
  }
};

// ==========================================
// CANCEL CUSTOMER ORDER
// ==========================================

export const cancelMyOrder = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;

    connection = await pool.getConnection();

    await connection.beginTransaction();

    const [orders] = await connection.query(
      `SELECT id, status
       FROM orders
       WHERE id = ? AND user_id = ?
       FOR UPDATE`,
      [id, req.user.id]
    );

    if (orders.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    if (!["pending"].includes(order.status)) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled",
      });
    }

    // Restore stock for cancelled order
    const [items] = await connection.query(
      `SELECT product_id, quantity
       FROM order_items
       WHERE order_id = ?`,
      [id]
    );

    for (const item of items) {
      await connection.query(
        `UPDATE products
         SET stock_quantity = stock_quantity + ?
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await connection.query(
      `UPDATE orders
       SET status = 'cancelled'
       WHERE id = ? AND user_id = ?`,
      [id, req.user.id]
    );

    await connection.commit();

    return res.json({
      success: true,
      message: "Order cancelled successfully",
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Cancel order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel order",
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
};
