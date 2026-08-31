import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| Create UPI Payment
|--------------------------------------------------------------------------
| Creates a UPI payment record for an order.
|
| paymentMethod:
|   - upi
|  
|   transactionId = customer's UPI UTR / transaction reference
|--------------------------------------------------------------------------
*/
export const createPayment = async ({
  orderId,
  userId,
  paymentMethod,
  amount,
  status = "pending",
  paymentGateway = null,
  transactionId = null,
}) => {
  const [result] = await pool.query(
    `
    INSERT INTO payments
    (
      order_id,
      user_id,
      payment_method,
      transaction_id,
      payment_gateway,
      amount,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      orderId,
      userId,
      paymentMethod,
      transactionId,
      paymentGateway,
      amount,
      status,
    ]
  );

  return result.insertId;
};


/*
|--------------------------------------------------------------------------
| Get Payment By ID
|--------------------------------------------------------------------------
*/
export const findPaymentById = async (id) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| Get Payment By Order ID
|--------------------------------------------------------------------------
*/
export const findPaymentByOrderId = async (orderId) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE order_id = ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [orderId]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| Get Current User's Payments
|--------------------------------------------------------------------------
*/
export const findPaymentsByUserId = async (userId) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM payments
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| Update Payment Status
|--------------------------------------------------------------------------
| General payment status update.
|
| Possible statuses:
|   pending
|   processing
|   paid
|   failed
|   refunded
|--------------------------------------------------------------------------
*/
export const updatePaymentStatus = async (
  paymentId,
  status
) => {
  await pool.query(
    `
    UPDATE payments
    SET
      status = ?,
      paid_at = CASE
        WHEN ? = 'paid'
        THEN CURRENT_TIMESTAMP
        ELSE paid_at
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
};


/*
|--------------------------------------------------------------------------
| Update UPI Transaction Details
|--------------------------------------------------------------------------
| Used when customer submits or updates their UPI UTR.
|--------------------------------------------------------------------------
*/
export const updateGatewayDetails = async (
  paymentId,
  {
    transactionId,
  }
) => {
  await pool.query(
    `
    UPDATE payments
    SET
      transaction_id = ?,
      payment_gateway = 'upi',
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    [
      transactionId,
      paymentId,
    ]
  );
};


// Get all pending/processing UPI payments for admin
export const findPendingUpiPayments = async () => {
  const [rows] = await pool.query(
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
      p.created_at,
      p.updated_at,
      u.name AS customer_name,
      u.email AS customer_email,
      u.phone AS customer_phone,
      o.order_number,
      o.total_amount AS order_total
    FROM payments p
    INNER JOIN users u
      ON u.id = p.user_id
    INNER JOIN orders o
      ON o.id = p.order_id
    WHERE p.payment_method = 'upi'
      AND p.status IN ('pending', 'processing')
    ORDER BY p.created_at ASC
    `
  );

  return rows;
};


// Update payment verification status
export const verifyPayment = async (
  paymentId,
  status
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Get payment
    const [payments] = await connection.query(
      `
      SELECT
        id,
        order_id,
        user_id,
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
      throw new Error("Payment not found");
    }

    const payment = payments[0];

    // Prevent changing an already completed payment
    if (
      payment.status === "paid" ||
      payment.status === "failed"
    ) {
      throw new Error(
        `Payment is already ${payment.status}`
      );
    }

    // Update payment
    await connection.query(
      `
      UPDATE payments
      SET
        status = ?,
        paid_at = CASE
          WHEN ? = 'paid'
          THEN CURRENT_TIMESTAMP
          ELSE paid_at
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

    // If payment is approved
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

    }

    // If payment is rejected
    if (status === "failed") {

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

    await connection.commit();

    return true;

  } catch (error) {

    await connection.rollback();

    throw error;

  } finally {

    connection.release();

  }
};