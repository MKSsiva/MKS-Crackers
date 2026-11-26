import pool from "../config/db.js";

const allowedStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

// ==========================================
// GET ALL ORDERS - ADMIN
// ==========================================
export const getAllOrders = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      payment_status = "",
    } = req.query;

    let sql = `
      SELECT
        o.id,
        o.order_number,
        o.user_id,
        o.address_id,
        o.subtotal,
        o.discount_amount,
        o.shipping_amount,
        o.total_amount,
        o.status,
        o.payment_status,
        o.payment_method,
        o.created_at,
        o.updated_at,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        a.city AS delivery_city,
        a.state AS delivery_state,
        (
          SELECT COUNT(*)
          FROM order_items oi
          WHERE oi.order_id = o.id
        ) AS total_items
      FROM orders o
      INNER JOIN users u ON u.id = o.user_id
      LEFT JOIN addresses a
        ON a.id = o.address_id
      WHERE 1 = 1
    `;

    const params = [];

    if (search.trim()) {
      sql += `
        AND (
          o.order_number LIKE ?
          OR u.name LIKE ?
          OR u.email LIKE ?
          OR u.phone LIKE ?
        )
      `;

      const keyword = `%${search.trim()}%`;

      params.push(
        keyword,
        keyword,
        keyword,
        keyword
      );
    }

    if (status && allowedStatuses.includes(status)) {
      sql += " AND o.status = ?";
      params.push(status);
    }

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (
      payment_status &&
      allowedPaymentStatuses.includes(payment_status)
    ) {
      sql += " AND o.payment_status = ?";
      params.push(payment_status);
    }

    sql += " ORDER BY o.created_at DESC";

    const [orders] = await pool.query(sql, params);

    return res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve orders",
    });
  }
};

// ==========================================
// GET SINGLE ORDER DETAILS - ADMIN
// ==========================================
export const getAdminOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await pool.query(
      `
        SELECT
          o.*,
          u.name AS customer_name,
          u.email AS customer_email,
          u.phone AS customer_phone,

          a.name AS address_name,
          a.phone AS address_phone,
          a.address_line1,
          a.address_line2,
          a.landmark,
          a.city,
          a.state,
          a.pincode,
          a.address_type

        FROM orders o

        INNER JOIN users u
          ON u.id = o.user_id

        LEFT JOIN addresses a
          ON a.id = o.address_id

        WHERE o.id = ?
        LIMIT 1
      `,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    const [items] = await pool.query(
      `
        SELECT
          id,
          order_id,
          product_id,
          product_name,
          sku,
          quantity,
          price,
          subtotal,
          created_at
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
      `,
      [id]
    );

    const [payments] = await pool.query(
      `
        SELECT
          id,
          order_id,
          user_id,
          payment_method,
          transaction_id,
          payment_gateway,
          amount,
          status,
          gateway_order_id,
          gateway_payment_id,
          paid_at,
          created_at,
          updated_at
        FROM payments
        WHERE order_id = ?
        ORDER BY id DESC
      `,
      [id]
    );

    return res.json({
      success: true,
      order: {
        ...order,
        items,
        payments,
      },
    });
  } catch (error) {
    console.error("Admin order details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve order details",
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS - ADMIN
// ==========================================
export const updateOrderStatus = async (req, res) => {
  let connection;

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [orders] = await connection.query(
      `
        SELECT id, status, payment_status
        FROM orders
        WHERE id = ?
        FOR UPDATE
      `,
      [id]
    );

    if (orders.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    if (order.status === status) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: `Order is already ${status}`,
      });
    }

    if (
      order.status === "cancelled" ||
      order.status === "delivered"
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This order can no longer be updated",
      });
    }

    // Restore stock only when cancelling an order
    // that has not been shipped or delivered.
    if (status === "cancelled") {
      if (
        !["pending", "confirmed", "processing"].includes(
          order.status
        )
      ) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message: "Only unshipped orders can be cancelled",
        });
      }

      const [items] = await connection.query(
        `
          SELECT product_id, quantity
          FROM order_items
          WHERE order_id = ?
        `,
        [id]
      );

      for (const item of items) {
        await connection.query(
          `
            UPDATE products
            SET stock_quantity = stock_quantity + ?
            WHERE id = ?
          `,
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.query(
      `
        UPDATE orders
        SET status = ?
        WHERE id = ?
      `,
      [status, id]
    );

    await connection.commit();

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        id: Number(id),
        status,
      },
      refund_note:
        status === "cancelled" &&
        order.payment_status === "paid"
          ? "Payment was already marked paid. Process the refund separately and update the payment records after verification."
          : null,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Admin update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
