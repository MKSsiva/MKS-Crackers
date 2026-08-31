import {
  createPayment,
  findPaymentById,
  findPaymentByOrderId,
  findPaymentsByUserId,
} from "../models/paymentModel.js";

import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| CUSTOMER - SUBMIT UPI PAYMENT
|--------------------------------------------------------------------------
*/

export const submitUpiPayment = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      order_id,
      transaction_id,
    } = req.body;

    // Validate order ID
    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Validate transaction ID
    if (!transaction_id) {
      return res.status(400).json({
        success: false,
        message: "UPI transaction ID is required",
      });
    }

    const transactionId =
      String(transaction_id).trim();

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "UPI transaction ID cannot be empty",
      });
    }

    // Find order belonging to customer
    const [orders] = await pool.query(
      `
      SELECT
        id,
        user_id,
        order_number,
        total_amount,
        payment_status,
        status
      FROM orders
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [order_id, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    // Already paid
    if (order.payment_status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Find existing payment
    const existingPayment =
      await findPaymentByOrderId(order_id);

    if (existingPayment) {

      // Already paid
      if (existingPayment.status === "paid") {
        return res.status(400).json({
          success: false,
          message: "Payment is already completed",
        });
      }

      // Update existing payment
      await pool.query(
        `
        UPDATE payments
        SET
          payment_method = 'upi',
          transaction_id = ?,
          payment_gateway = 'upi',
          status = 'processing',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
          AND user_id = ?
        `,
        [
          transactionId,
          existingPayment.id,
          userId,
        ]
      );

      const updatedPayment =
        await findPaymentById(existingPayment.id);

      return res.json({
        success: true,
        message:
          "UPI payment submitted for verification",
        payment: updatedPayment,
      });
    }

    // Create new UPI payment
    const paymentId = await createPayment({
      orderId: order_id,
      userId,
      paymentMethod: "upi",
      transactionId,
      amount: order.total_amount,
      status: "processing",
      paymentGateway: "upi",
    });

    const payment =
      await findPaymentById(paymentId);

    return res.status(201).json({
      success: true,
      message:
        "UPI payment submitted for verification",
      payment,
    });

  } catch (error) {

    console.error(
      "Submit UPI Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit UPI payment",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CUSTOMER - GET PAYMENT BY ID
|--------------------------------------------------------------------------
*/

export const getPayment = async (req, res) => {
  try {

    const userId = req.user.id;
    const paymentId = req.params.id;

    const payment =
      await findPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Customer can only access own payment
    if (
      req.user.role !== "admin" &&
      Number(payment.user_id) !== Number(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.json({
      success: true,
      payment,
    });

  } catch (error) {

    console.error(
      "Get Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get payment",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CUSTOMER - GET MY PAYMENTS
|--------------------------------------------------------------------------
*/

export const getMyPayments = async (req, res) => {
  try {

    const payments =
      await findPaymentsByUserId(req.user.id);

    return res.json({
      success: true,
      payments,
    });

  } catch (error) {

    console.error(
      "Get My Payments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get payments",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CUSTOMER - GET PAYMENT FOR ORDER
|--------------------------------------------------------------------------
*/

export const getOrderPayment = async (req, res) => {
  try {

    const userId = req.user.id;
    const orderId = req.params.orderId;

    // Check order
    const [orders] = await pool.query(
      `
      SELECT
        id,
        user_id,
        order_number,
        total_amount,
        payment_status
      FROM orders
      WHERE id = ?
      LIMIT 1
      `,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Customer can only access own order
    if (
      req.user.role !== "admin" &&
      Number(orders[0].user_id) !== Number(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const payment =
      await findPaymentByOrderId(orderId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment not found for this order",
      });
    }

    return res.json({
      success: true,
      payment,
    });

  } catch (error) {

    console.error(
      "Get Order Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get order payment",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - GET PENDING UPI PAYMENTS
|--------------------------------------------------------------------------
*/

export const getAdminPendingPayments = async (
  req,
  res
) => {
  try {

    const [payments] = await pool.query(
      `
      SELECT
        p.id,
        p.order_id,
        p.user_id,
        p.payment_method,
        p.transaction_id,
        p.payment_gateway,
        p.amount,
        p.status,
        p.paid_at,
        p.created_at,
        p.updated_at,

        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        o.order_number,
        o.total_amount AS order_total,
        o.payment_status AS order_payment_status,
        o.status AS order_status

      FROM payments p

      INNER JOIN users u
        ON u.id = p.user_id

      INNER JOIN orders o
        ON o.id = p.order_id

      WHERE p.payment_method = 'upi'
        AND p.status IN (
          'pending',
          'processing'
        )

      ORDER BY p.created_at ASC
      `
    );

    return res.json({
      success: true,
      payments,
    });

  } catch (error) {

    console.error(
      "Get Admin Pending Payments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get pending payments",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL UPI PAYMENTS
|--------------------------------------------------------------------------
*/

export const getAdminAllPayments = async (
  req,
  res
) => {
  try {

    const [payments] = await pool.query(
      `
      SELECT
        p.id,
        p.order_id,
        p.user_id,
        p.payment_method,
        p.transaction_id,
        p.payment_gateway,
        p.amount,
        p.status,
        p.paid_at,
        p.created_at,
        p.updated_at,

        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        o.order_number,
        o.total_amount AS order_total,
        o.payment_status AS order_payment_status,
        o.status AS order_status

      FROM payments p

      INNER JOIN users u
        ON u.id = p.user_id

      INNER JOIN orders o
        ON o.id = p.order_id

      WHERE p.payment_method = 'upi'

      ORDER BY p.created_at DESC
      `
    );

    return res.json({
      success: true,
      payments,
    });

  } catch (error) {

    console.error(
      "Get Admin All Payments Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get payments",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - GET SINGLE UPI PAYMENT
|--------------------------------------------------------------------------
*/

export const getAdminPayment = async (
  req,
  res
) => {
  try {

    const paymentId = req.params.id;

    const [payments] = await pool.query(
      `
      SELECT
        p.id,
        p.order_id,
        p.user_id,
        p.payment_method,
        p.transaction_id,
        p.payment_gateway,
        p.amount,
        p.status,

        p.gateway_order_id,
        p.gateway_payment_id,
        p.gateway_signature,

        p.paid_at,
        p.created_at,
        p.updated_at,

        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        o.order_number,
        o.subtotal,
        o.discount_amount,
        o.shipping_amount,
        o.total_amount,
        o.payment_status AS order_payment_status,
        o.status AS order_status

      FROM payments p

      INNER JOIN users u
        ON u.id = p.user_id

      INNER JOIN orders o
        ON o.id = p.order_id

      WHERE p.id = ?
        AND p.payment_method = 'upi'

      LIMIT 1
      `,
      [paymentId]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "UPI payment not found",
      });
    }

    return res.json({
      success: true,
      payment: payments[0],
    });

  } catch (error) {

    console.error(
      "Get Admin Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get payment",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - VERIFY UPI PAYMENT
|--------------------------------------------------------------------------
|
| Admin:
|
|   paid   = approve
|   failed = reject
|
|--------------------------------------------------------------------------
*/

export const verifyUpiPayment = async (
  req,
  res
) => {

  const connection =
    await pool.getConnection();

  try {

    const paymentId = req.params.id;
    const { status } = req.body;

    // -------------------------------------------------
    // Validate status
    // -------------------------------------------------

    if (!["paid", "failed"].includes(status)) {

      connection.release();

      return res.status(400).json({
        success: false,
        message:
          "Status must be either paid or failed",
      });
    }

    await connection.beginTransaction();

    // -------------------------------------------------
    // Get payment
    // -------------------------------------------------

    const [payments] =
      await connection.query(
        `
        SELECT
          id,
          order_id,
          user_id,
          payment_method,
          transaction_id,
          amount,
          status
        FROM payments
        WHERE id = ?
        LIMIT 1
        FOR UPDATE
        `,
        [paymentId]
      );

    if (payments.length === 0) {

      await connection.rollback();
      connection.release();

      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const payment = payments[0];

    // -------------------------------------------------
    // Only UPI
    // -------------------------------------------------

    if (payment.payment_method !== "upi") {

      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message:
          "Only UPI payments can be verified",
      });
    }

    // -------------------------------------------------
    // Transaction ID required
    // -------------------------------------------------

    if (!payment.transaction_id) {

      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message:
          "UPI transaction ID is missing",
      });
    }

    // -------------------------------------------------
    // Prevent duplicate verification
    // -------------------------------------------------

    if (payment.status === "paid") {

      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message:
          "Payment is already paid",
      });
    }

    if (payment.status === "failed") {

      await connection.rollback();
      connection.release();

      return res.status(400).json({
        success: false,
        message:
          "Payment is already marked as failed",
      });
    }

    // -------------------------------------------------
    // Update payment
    // -------------------------------------------------

    await connection.query(
      `
      UPDATE payments
      SET
        status = ?,

        paid_at =
          CASE
            WHEN ? = 'paid'
            THEN CURRENT_TIMESTAMP
            ELSE NULL
          END,

        updated_at = CURRENT_TIMESTAMP

      WHERE id = ?
      `,
      [
        status,
        status,
        paymentId,
      ]
    );

    // -------------------------------------------------
    // Update order
    // -------------------------------------------------

    if (status === "paid") {

      await connection.query(
        `
        UPDATE orders
        SET
          payment_status = 'paid',
          status = 'processing',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [payment.order_id]
      );

    } else {

      await connection.query(
        `
        UPDATE orders
        SET
          payment_status = 'failed',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [payment.order_id]
      );
    }

    // -------------------------------------------------
    // Commit transaction
    // -------------------------------------------------

    await connection.commit();

    return res.json({
      success: true,
      message:
        status === "paid"
          ? "UPI payment approved successfully"
          : "UPI payment rejected successfully",
    });

  } catch (error) {

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Rollback Error:",
        rollbackError
      );
    }

    console.error(
      "Verify UPI Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to verify UPI payment",
    });

  } finally {

    connection.release();
  }
};

