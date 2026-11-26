
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const right = pageWidth - 18;

  const orderNumber =
    order.order_number || order.orderNumber || order.id;

  const formatMoney = (value) =>
    `Rs. ${Number(value || 0).toFixed(2)}`;

  const deliveryAddress = [
    address.address_line1,
    address.address_line2,
    address.landmark,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean).join(", ");

  // Branded header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, pageWidth, 43, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MKS CRACKERS", 18, 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("QUALITY PRODUCTS FOR EVERY CELEBRATION", 18, 27);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("ESTIMATED BILL", right, 19, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Order invoice", right, 27, { align: "right" });

  // Order information panel
  let y = 55;

  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ORDER INFORMATION", 18, y);

  y += 8;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, y - 5, pageWidth - 32, 35, 3, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const leftX = 21;
  const rightX = 112;

  doc.text("Order Number", leftX, y + 3);
  doc.text(String(orderNumber || "-"), leftX, y + 10);

  doc.text("Order Date", rightX, y + 3);
  doc.text(new Date(
    order.created_at || Date.now()
  ).toLocaleString("en-IN"), rightX, y + 10);

  doc.text("Order Status", leftX, y + 22);
  doc.text(String(order.status || "pending").toUpperCase(), leftX + 28, y + 22);

  doc.text("Payment", rightX, y + 22);
  doc.text(
    `${String(order.payment_method || "UPI").toUpperCase()} / ${String(order.payment_status || "PENDING").toUpperCase()}`,
    rightX + 25,
    y + 22
  );

  y += 43;

  // Customer and delivery details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CUSTOMER & DELIVERY DETAILS", 18, y);

  y += 8;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, y - 5, pageWidth - 32, 37, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Customer", 21, y + 3);
  doc.text("Mobile Number", 112, y + 3);

  doc.setFont("helvetica", "normal");
  doc.text(String(customer.name || address.name || "-"), 21, y + 11);
  doc.text(String(customer.phone || address.phone || "-"), 112, y + 11);

  doc.setFont("helvetica", "bold");
  doc.text("Delivery Address", 21, y + 21);

  doc.setFont("helvetica", "normal");
  const addressLines = doc.splitTextToSize(
    deliveryAddress || "Address not available",
    165
  );

  doc.text(addressLines.slice(0, 2), 21, y + 27);

  y += 47;

  // Products table
  const drawTableHeader = () => {
    doc.setFillColor(30, 41, 59);
    doc.rect(16, y - 5, pageWidth - 32, 11, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    doc.text("PRODUCT", 20, y + 2);
    doc.text("QTY", 120, y + 2);
    doc.text("PRICE", 151, y + 2, { align: "right" });
    doc.text("AMOUNT", right - 2, y + 2, { align: "right" });

    y += 13;
    doc.setTextColor(30, 41, 59);
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("ORDERED PRODUCTS", 18, y);

  y += 9;
  drawTableHeader();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  items.forEach((item, index) => {
    const name =
      item.product_name ||
      item.name ||
      item.product?.name ||
      "Product";

    const quantity = Number(item.quantity || 1);
    const price = Number(
      item.sale_price ?? item.price ?? 0
    );

    const amount = Number(
      item.subtotal ?? quantity * price
    );

    const nameLines = doc.splitTextToSize(name, 88);
    const rowHeight = Math.max(10, nameLines.length * 4 + 5);

    if (y + rowHeight > 265) {
      doc.addPage();
      y = 20;
      drawTableHeader();
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(16, y - 4, pageWidth - 32, rowHeight, "F");
    }

    doc.text(nameLines, 20, y + 2);
    doc.text(String(quantity), 120, y + 2);
    doc.text(price.toFixed(2), 151, y + 2, {
      align: "right",
    });
    doc.text(amount.toFixed(2), right - 2, y + 2, {
      align: "right",
    });

    y += rowHeight;
  });

  y += 10;

  if (y > 250) {
    doc.addPage();
    y = 25;
  }

  // Totals panel
  const subtotal = Number(state?.subtotal ?? total);
  const shipping = Number(state?.shipping || 0);
  const discount = Number(
    order.discount_amount ?? 0
  );

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(105, y - 5, 89, 42, 3, 3, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  doc.text("Subtotal", 111, y + 3);
  doc.text(formatMoney(subtotal), 188, y + 3, {
    align: "right",
  });

  doc.text("Discount", 111, y + 12);
  doc.text(`- ${formatMoney(discount)}`, 188, y + 12, {
    align: "right",
  });

  doc.text("Shipping", 111, y + 21);
  doc.text(formatMoney(shipping), 188, y + 21, {
    align: "right",
  });

  doc.setDrawColor(203, 213, 225);
  doc.line(111, y + 25, 188, y + 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL", 111, y + 33);
  doc.text(formatMoney(total), 188, y + 33, {
    align: "right",
  });

  // Footer
  y += 55;

  if (y > 275) {
    doc.addPage();
    y = 25;
  }

  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Thank you for shopping with MKS Crackers!",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  doc.text(
    "This is an estimated bill. Payment confirmation is subject to verification.",
    pageWidth / 2,
    y + 6,
    { align: "center" }
  );

  doc.setTextColor(30, 41, 59);

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
        <div className="confirmation-success-animation">
          <div className="confirmation-success-ring"></div>
        
          <div className="confirmation-success-icon">
            <svg viewBox="0 0 52 52" aria-hidden="true">
              <path
                className="confirmation-checkmark"
                d="M14 27 L22 35 L39 17"
              />
            </svg>
          </div>
        </div>
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
          <span>📄</span>
            Download Estimated Bill & Continue Shopping
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
