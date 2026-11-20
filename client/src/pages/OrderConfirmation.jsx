
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;
  const customer = state?.customer || {};
  const address = state?.address || {};
  const items = state?.items || [];

  if (!order) {
    return (
      <main className="confirmation-page">
        <section className="confirmation-card">
          <h2>Order information unavailable</h2>
          <p>Please check your order history.</p>
          <button onClick={() => navigate("/my-orders")}>
            View My Orders
          </button>
        </section>
      </main>
    );
  }

  const orderNumber =
    order.order_number ||
    order.orderNumber ||
    order.id ||
    "Order Placed";

  const total = Number(
    order.total_amount ?? state?.total ?? 0
  );

  const phone = String(customer.phone || address.phone || "")
    .replace(/\D/g, "");

  const whatsappPhone =
    phone.length === 10 ? `91${phone}` : phone;

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toFixed(2)}`;

  const getAddress = () =>
    [
      address.address_line1,
      address.address_line2,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");

  const generateBill = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("MKS CRACKERS", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text("ESTIMATED ORDER BILL", 105, 29, {
      align: "center",
    });

    doc.line(15, 35, 195, 35);

    doc.setFontSize(10);

    let y = 45;

    const line = (label, value) => {
      doc.text(`${label}: ${String(value || "-")}`, 18, y);
      y += 8;
    };

    line("Order Number", orderNumber);
    line("Customer Name", customer.name);
    line("Mobile Number", customer.phone);
    line("Order Date", new Date().toLocaleString("en-IN"));
    line("Order Status", order.status || "pending");
    line("Payment Method", order.payment_method || "upi");
    line("Payment Status", order.payment_status || "pending");

    y += 4;
    doc.text("DELIVERY ADDRESS", 18, y);
    y += 8;

    const addressLines = doc.splitTextToSize(
      getAddress() || "Address unavailable",
      170
    );

    doc.text(addressLines, 18, y);
    y += addressLines.length * 6 + 8;

    doc.text("ORDERED PRODUCTS", 18, y);
    y += 9;

    doc.text("Product", 18, y);
    doc.text("Qty", 125, y);
    doc.text("Price", 150, y);
    doc.text("Amount", 190, y, { align: "right" });

    y += 5;
    doc.line(18, y, 192, y);
    y += 8;

    items.forEach((item) => {
      if (y > 265) {
        doc.addPage();
        y = 20;
      }

      const name =
        item.product_name ||
        item.name ||
        item.product?.name ||
        "Product";

      const quantity = Number(item.quantity || 1);
      const price = Number(
        item.sale_price ?? item.price ?? 0
      );

      const amount = quantity * price;

      doc.text(
        doc.splitTextToSize(name, 95),
        18,
        y
      );

      doc.text(String(quantity), 125, y);
      doc.text(price.toFixed(2), 150, y);
      doc.text(amount.toFixed(2), 190, y, {
        align: "right",
      });

      y += 9;
    });

    y += 5;
    doc.line(18, y, 192, y);
    y += 10;

    doc.text("Subtotal", 140, y);
    doc.text(
      formatCurrency(state?.subtotal ?? total),
      190,
      y,
      { align: "right" }
    );

    y += 8;

    doc.text("Shipping", 140, y);
    doc.text(
      formatCurrency(state?.shipping || 0),
      190,
      y,
      { align: "right" }
    );

    y += 10;

    doc.setFontSize(13);
    doc.text("TOTAL AMOUNT", 130, y);
    doc.text(formatCurrency(total), 190, y, {
      align: "right",
    });

    y += 15;
    doc.setFontSize(9);
    doc.text(
      "This is an estimated bill. Final payment confirmation is subject to verification.",
      105,
      y,
      { align: "center", maxWidth: 175 }
    );

    return doc;
  };

  const handleContinueShopping = () => {
    const doc = generateBill();

    const safeOrderNumber = String(orderNumber).replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

    const filename = `MKS-${safeOrderNumber}-Estimated-Bill.pdf`;

    // Download the estimated bill.
    doc.save(filename);

    // Open WhatsApp with a prepared message.
    if (whatsappPhone) {
      const message = encodeURIComponent(
        `Hello ${customer.name || "Customer"}, thank you for ordering with MKS Crackers. Your estimated bill for order ${orderNumber} has been downloaded. Please attach the downloaded PDF to this WhatsApp chat.`
      );

      window.open(
        `https://wa.me/${whatsappPhone}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );
    }

    navigate("/products");
  };

  return (
    <main className="confirmation-page">
      <section className="confirmation-card">
        <div className="confirmation-success-icon">✓</div>

        <h1>Thank You for Your Order!</h1>

        <p className="confirmation-description">
          Your order has been placed successfully.
          We appreciate your shopping with MKS Crackers.
        </p>

        <div className="confirmation-details">
          <div>
            <span>Order Number</span>
            <strong>{orderNumber}</strong>
          </div>

          <div>
            <span>Order Status</span>
            <strong>{String(order.status || "pending").toUpperCase()}</strong>
          </div>

          <div>
            <span>Payment Method</span>
            <strong>{String(order.payment_method || "upi").toUpperCase()}</strong>
          </div>

          <div>
            <span>Payment Status</span>
            <strong>
              {String(order.payment_status || "pending").toUpperCase()}
            </strong>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>{customer.name || "Not available"}</strong>
          </div>

          <div>
            <span>Mobile Number</span>
            <strong>{customer.phone || "Not available"}</strong>
          </div>
        </div>

        <p className="confirmation-note">
          You can check your order details and status from My Orders.
        </p>

        <button
          className="confirmation-primary-button"
          onClick={() => navigate("/my-orders")}
        >
          View My Orders
        </button>

        <button
          className="confirmation-secondary-button"
          onClick={handleContinueShopping}
        >
          Continue Shopping & Get Estimated Bill
        </button>

        <small className="confirmation-whatsapp-note">
          Your estimated bill will download and WhatsApp will open
          with a prepared message. Attach the downloaded PDF before sending.
        </small>
      </section>
    </main>
  );
}

export default OrderConfirmation;
