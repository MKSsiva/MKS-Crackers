
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./OrderDetails.css";

const unwrap = (response) => response?.data ?? response;

const money = (value) => `₹${Number(value || 0).toFixed(2)}`;

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadOrder();
  }, [id, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = unwrap(await api.get(`/orders/${id}`));

      setOrder(response.order || response.data?.order || null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load order details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      await api.put(`/orders/${id}/cancel`);

      await loadOrder();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to cancel this order."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <main className="order-details-page">Loading order...</main>;
  }

  if (error && !order) {
    return (
      <main className="order-details-page">
        <p className="order-details-error">{error}</p>
        <button onClick={() => navigate("/my-orders")}>
          Back to My Orders
        </button>
      </main>
    );
  }

  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];

  const address = order.address || order.delivery_address || {};

  const addressText = [
    address.address_line1,
    address.address_line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  const statusList = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentStatus = String(order.status || "pending").toLowerCase();
  const currentIndex = statusList.indexOf(currentStatus);

  const canCancel = currentStatus === "pending";

  return (
    <main className="order-details-page">
      <div className="order-details-container">
        <button
          className="back-orders-button"
          onClick={() => navigate("/my-orders")}
        >
          ← Back to My Orders
        </button>

        <h1>Order Details</h1>
        <p className="order-details-number">
          Order #{order.order_number}
        </p>

        {error && <div className="order-details-error">{error}</div>}

        <section className="order-detail-card">
          <h2>Customer Information</h2>

          <div className="order-detail-grid">
            <div>
              <span>Customer Name</span>
              <strong>{order.customer_name || order.address_name || "Not available"}</strong>
            </div>

            <div>
              <span>Mobile Number</span>
              <strong>{order.customer_phone || order.address_phone || "Not available"}</strong>
            </div>
          </div>
        </section>

        <section className="order-detail-card">
          <h2>Order Information</h2>

          <div className="order-detail-grid">
            <div>
              <span>Order Number</span>
              <strong>{order.order_number}</strong>
            </div>

            <div>
              <span>Order Date</span>
              <strong>
                {new Date(order.created_at).toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Payment Method</span>
              <strong>{String(order.payment_method || "upi").toUpperCase()}</strong>
            </div>

            <div>
              <span>Payment Status</span>
              <strong>{String(order.payment_status || "pending").toUpperCase()}</strong>
            </div>
          </div>
        </section>

        <section className="order-detail-card">
          <h2>Order Tracking</h2>

          <div className="order-tracking">
            {statusList.map((status, index) => (
              <div
                key={status}
                className={`tracking-step ${
                  index <= currentIndex ? "completed" : ""
                }`}
              >
                <span>{index <= currentIndex ? "✓" : index + 1}</span>
                <strong>{status}</strong>
              </div>
            ))}
          </div>

          {currentStatus === "cancelled" && (
            <p className="cancelled-message">This order has been cancelled.</p>
          )}
        </section>

        <section className="order-detail-card">
          <h2>Ordered Products</h2>

          {items.length === 0 ? (
            <p>Order item details are unavailable in this response.</p>
          ) : (
            <div className="order-products-list">
              {items.map((item) => (
                <div className="order-product-row" key={item.id}>
                  <div>
                    <strong>{item.product_name || item.name || "Product"}</strong>
                    {item.sku && <small>SKU: {item.sku}</small>}
                    <small>Quantity: {item.quantity}</small>
                  </div>

                  <strong>{money(item.subtotal)}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="order-detail-card">
          <h2>Price Summary</h2>

          <div className="order-price-row">
            <span>Subtotal</span>
            <strong>{money(order.subtotal)}</strong>
          </div>

          <div className="order-price-row">
            <span>Discount</span>
            <strong>-{money(order.discount_amount)}</strong>
          </div>

          <div className="order-price-row">
            <span>Shipping</span>
            <strong>{money(order.shipping_amount)}</strong>
          </div>

          <div className="order-price-row order-final-total">
            <span>Total Amount</span>
            <strong>{money(order.total_amount)}</strong>
          </div>
        </section>

        <section className="order-detail-card">
          <h2>Delivery Address</h2>

          {addressText ? (
            <>
              <strong>{address.address_name || address.name || order.address_name}</strong>
              <p>{addressText}</p>
              <p>
                Phone: {address.address_phone || address.phone || order.address_phone || order.customer_phone}
              </p>
            </>
          ) : (
            <p>Delivery address details are unavailable in this response.</p>
          )}
        </section>

        <div className="order-details-actions">
          {canCancel && (
            <button
              className="cancel-order-button"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          <button
            className="continue-order-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
