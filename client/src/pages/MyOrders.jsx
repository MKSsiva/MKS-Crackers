
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
            <span className="orders-count">
              Total Orders: {orders.length}
            </span>

            <button
              className="orders-shopping-button"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
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
                <h2>{group.label}</h2>

                {group.orders.map((order) => (
                  <article className="my-order-card" key={order.id}>
                    <div className="my-order-top">
                      <div>
                        <span className="order-field-label">
                          Order Number
                        </span>
                        <strong>{order.order_number}</strong>
                      </div>

                      <span
                        className={`order-status status-${order.status}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="my-order-customer">
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
                    </div>

                    <div className="my-order-information">
                      <div>
                        <span>Order Date</span>
                        <strong>{formatDate(order.created_at)}</strong>
                      </div>

                      <div>
                        <span>Payment</span>
                        <strong>
                          {String(order.payment_status || "pending").toUpperCase()}
                        </strong>
                      </div>

                      <div>
                        <span>Total Amount</span>
                        <strong>
                          {formatCurrency(order.total_amount)}
                        </strong>
                      </div>

                      <div>
                        <span>Method</span>
                        <strong>
                          {String(order.payment_method || "upi").toUpperCase()}
                        </strong>
                      </div>
                    </div>

                    <button
                      className="order-details-button"
                      onClick={() =>
                        navigate(`/my-orders/${order.id}`)
                      }
                    >
                      View Details
                    </button>
                  </article>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyOrders;
