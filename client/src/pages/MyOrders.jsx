
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./MyOrders.css";

const unwrap = (response) => response?.data ?? response;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const formatCurrency = (value) =>
  `₹${Number(value || 0).toFixed(2)}`;

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadOrders();
  }, [navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = unwrap(await api.get("/orders"));

      setOrders(
        Array.isArray(response.orders) ? response.orders : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  const groupedOrders = useMemo(() => {
    const groups = {};

    orders.forEach((order) => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const monthLabel = date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthKey]) {
        groups[monthKey] = {
          label: monthLabel,
          orders: [],
        };
      }

      groups[monthKey].orders.push(order);
    });

    return Object.entries(groups);
  }, [orders]);

  if (loading) {
    return <div className="my-orders-page">Loading your orders...</div>;
  }

  return (
    <main className="my-orders-page">
      <div className="my-orders-container">
        <div className="my-orders-heading">
  <div>
    <h1>My Orders</h1>
    <p>View and track your MKS Crackers orders.</p>
  </div>

  <div className="my-orders-heading-actions">
    <div className="orders-count-card">
      <span className="orders-count-number">{orders.length}</span>
      <span className="orders-count-label">Total Orders</span>
    </div>

    <button
      className="orders-shopping-button"
      onClick={() => navigate("/products")}
    >
      <span>＋</span> Continue Shopping
    </button>
  </div>
</div>

        {error && <div className="orders-error">{error}</div>}

        {orders.length === 0 ? (
          <section className="orders-empty">
            <h2>No Orders Yet</h2>
            <p>Your placed orders will appear here.</p>
            <button onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </section>
        ) : (
          <div className="orders-groups">
            {groupedOrders.map(([monthKey, group]) => (
              <section className="orders-month-group" key={monthKey}>
  <div className="orders-month-heading">
    <div className="orders-month-title">
      <span className="orders-month-icon">▦</span>
      <div>
        <h2>{group.label}</h2>
        <p>
          {group.orders.length}{" "}
          {group.orders.length === 1 ? "order" : "orders"} this month
        </p>
      </div>
    </div>
  </div>

  <div className="orders-month-list">
    {group.orders.map((order) => {
      const isExpanded =
        String(expandedOrderId) === String(order.id);

      const orderStatus = String(
        order.status || "pending"
      ).toLowerCase();

      return (
        <article
          className={`my-order-card ${isExpanded ? "order-card-expanded" : ""}`}
          key={order.id}
        >
          <button
            type="button"
            className="my-order-card-header"
            aria-expanded={isExpanded}
            onClick={() =>
              setExpandedOrderId(
                isExpanded ? null : order.id
              )
            }
          >
            <div className="my-order-main-info">
              <span className="order-field-label">
                ORDER NUMBER
              </span>

              <strong className="my-order-number">
                {order.order_number || `#${order.id}`}
              </strong>

              <span className="my-order-date">
                <icon-placeholder />
                {formatDate(order.created_at)}
              </span>
            </div>

            <div className="my-order-header-right">
              <span
                className={`order-status status-${orderStatus}`}
              >
                {orderStatus}
              </span>

              <span className="order-expand-icon">
                {isExpanded ? "−" : "+"}
              </span>
            </div>
          </button>

          <div className="my-order-card-summary">
            <div>
              <span>Customer Name</span>
              <strong>
                {order.customer_name || "Not available"}
              </strong>
            </div>

            <div>
              <span>Mobile Number</span>
              <strong>
                {order.customer_phone || "Not available"}
              </strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>
                {String(order.payment_status || "pending").toUpperCase()}
              </strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong className="order-total-price">
                {formatCurrency(order.total_amount)}
              </strong>
            </div>
          </div>

          {isExpanded && (
            <div className="my-order-expanded-content">
              <div className="order-expanded-row">
                <span>Order Date</span>
                <strong>
                  {new Date(order.created_at).toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="order-expanded-row">
                <span>Payment Method</span>
                <strong>
                  {String(order.payment_method || "upi").toUpperCase()}
                </strong>
              </div>

              <div className="order-expanded-row">
                <span>Order Status</span>
                <strong className={`order-status-text status-text-${orderStatus}`}>
                  {orderStatus.toUpperCase()}
                </strong>
              </div>

              <button
                type="button"
                className="order-details-button"
                onClick={() =>
                  navigate(`/my-orders/${order.id}`)
                }
              >
                View Full Order Details
                <span> →</span>
              </button>
            </div>
          )}

          <button
            type="button"
            className="order-card-toggle"
            onClick={() =>
              setExpandedOrderId(
                isExpanded ? null : order.id
              )
            }
          >
            {isExpanded ? "Show Less" : "View Order Information"}
            <span>{isExpanded ? "⌃" : "⌄"}</span>
          </button>
        </article>
      );
    })}
  </div>
</section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
