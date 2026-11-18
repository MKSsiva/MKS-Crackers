
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, {
  getCart,
  updateCartItem,
  removeCartItem,
  checkoutOrder,
} from "../services/api";
import "./Cart.css";

const initialAddressForm = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  address_type: "home",
  is_default: false,
};

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(initialAddressForm);

  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadCartAndAddresses();
  }, [navigate]);

  const loadCartAndAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const [cartResponse, addressResponse] = await Promise.all([
        getCart(),
        api.get("/addresses"),
      ]);

      const cartItems =
        cartResponse.items ||
        cartResponse.cart?.items ||
        cartResponse.cart ||
        [];

      const addressList = addressResponse.data.addresses || [];

      setItems(Array.isArray(cartItems) ? cartItems : []);
      setAddresses(Array.isArray(addressList) ? addressList : []);

      if (addressList.length > 0) {
        const defaultAddress = addressList.find(
          (address) =>
            address.is_default === 1 ||
            address.is_default === true ||
            address.is_default === "1"
        );

        setAddressId(
          String((defaultAddress || addressList[0]).id)
        );
      }
    } catch (err) {
      console.error("Cart loading error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCartOnly = async () => {
    const response = await getCart();

    const cartItems =
      response.items ||
      response.cart?.items ||
      response.cart ||
      [];

    setItems(Array.isArray(cartItems) ? cartItems : []);
  };

  const getItemId = (item) => item.id ?? item.cart_id;

  const getItemPrice = (item) => {
    const salePrice =
      item.sale_price !== null &&
      item.sale_price !== undefined &&
      item.sale_price !== ""
        ? Number(item.sale_price)
        : null;

    return salePrice ?? Number(item.price || 0);
  };

  const getItemName = (item) =>
    item.product_name || item.name || "Product";

  const getItemImage = (item) =>
    item.primary_image ||
    item.image_url ||
    item.product_image ||
    "";

  const subtotal = items.reduce(
    (total, item) =>
      total + getItemPrice(item) * Number(item.quantity || 0),
    0
  );

  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();

    try {
      setSavingAddress(true);
      setError("");
      setMessage("");

      const response = await api.post("/addresses", {
        ...addressForm,
        is_default: addressForm.is_default ? 1 : 0,
      });

      if (response.data.success && response.data.address) {
        const newAddress = response.data.address;

        setAddresses((previous) => {
          if (addressForm.is_default) {
            return [
              ...previous.map((address) => ({
                ...address,
                is_default: 0,
              })),
              newAddress,
            ];
          }

          return [...previous, newAddress];
        });

        setAddressId(String(newAddress.id));
        setAddressForm(initialAddressForm);
        setShowAddressForm(false);
        setMessage("Delivery address added successfully.");
      } else {
        setError(response.data.message || "Unable to add address.");
      }
    } catch (err) {
      console.error("Add address error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to save your address. Please try again."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleQuantityChange = async (item, newQuantity) => {
    const quantity = Number(newQuantity);
    const itemId = getItemId(item);

    if (!Number.isInteger(quantity) || quantity < 1) return;

    const stock = Number(item.stock_quantity);

    if (Number.isFinite(stock) && stock > 0 && quantity > stock) {
      setError(
        `Only ${stock} units are available for ${getItemName(item)}.`
      );
      return;
    }

    try {
      setError("");
      setUpdatingId(itemId);

      const response = await updateCartItem(itemId, quantity);

      if (response.success) {
        await loadCartOnly();
      } else {
        setError(response.message || "Unable to update quantity.");
      }
    } catch (err) {
      console.error("Quantity update error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to update quantity."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (item) => {
    const itemId = getItemId(item);

    try {
      setError("");
      setUpdatingId(itemId);

      const response = await removeCartItem(itemId);

      if (response.success) {
        await loadCartOnly();
      } else {
        setError(response.message || "Unable to remove item.");
      }
    } catch (err) {
      console.error("Remove cart item error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to remove item."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!addressId) {
      setError("Please add or select a delivery address.");
      return;
    }

    try {
      setCheckingOut(true);
      setError("");
      setMessage("");

      const response = await checkoutOrder({
        address_id: Number(addressId),
        payment_method: "upi",
      });

      if (response.success) {
        setOrder(response.order || response.data?.order || response);
        setItems([]);
      } else {
        setError(response.message || "Checkout failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to place your order. Please try again."
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const getAddressText = (address) =>
    [
      address.address_line1,
      address.address_line2,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(", ");

  if (loading) {
    return (
      <div className="cart-status">
        <div className="cart-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (order) {
    return (
      <main className="cart-page">
        <section className="order-success">
          <div className="order-success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with MKS Crackers.</p>

          <div className="order-summary">
            <p>
              <strong>Order Number:</strong>{" "}
              {order.order_number || order.orderNumber || order.id || "Placed"}
            </p>
            <p>
              <strong>Order Status:</strong> {order.status || "pending"}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {order.payment_status || "pending"}
            </p>
          </div>

          <p className="order-email-message">
            {order.email_sent
              ? "Your order confirmation email has been sent."
              : "Your order was placed, but email delivery could not be confirmed."}
          </p>

          <button onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <section className="cart-heading">
        <h1>Shopping Cart</h1>
        <p>Review your products before placing your order.</p>
      </section>

      {error && (
        <div className="cart-error">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {message && (
        <div className="cart-message">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {items.length === 0 ? (
        <section className="cart-empty">
          <div>🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Add some products to your cart to continue.</p>
          <button onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {items.map((item) => {
              const itemId = getItemId(item);
              const image = getItemImage(item);
              const price = getItemPrice(item);
              const quantity = Number(item.quantity || 1);

              return (
                <article className="cart-item" key={itemId}>
                  <div className="cart-item-image">
                    {image ? (
                      <img src={image} alt={getItemName(item)} />
                    ) : (
                      <span>🎆</span>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h2>{getItemName(item)}</h2>
                    <p className="cart-item-price">
                      ₹{price.toFixed(2)}
                    </p>

                    <div className="cart-quantity">
                      <button
                        disabled={updatingId === itemId || quantity <= 1}
                        onClick={() =>
                          handleQuantityChange(item, quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        disabled={
                          updatingId === itemId ||
                          (Number(item.stock_quantity) > 0 &&
                            quantity >= Number(item.stock_quantity))
                        }
                        onClick={() =>
                          handleQuantityChange(item, quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-cart-item"
                      disabled={updatingId === itemId}
                      onClick={() => handleRemoveItem(item)}
                    >
                      {updatingId === itemId ? "Updating..." : "Remove"}
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ₹{(price * quantity).toFixed(2)}
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Items</span>
              <span>{items.length}</span>
            </div>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <div className="cart-address-section">
              <h3>Delivery Address</h3>

              {addresses.length > 0 && (
                <select
                  value={addressId}
                  onChange={(event) => setAddressId(event.target.value)}
                >
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.name} - {getAddressText(address)}
                    </option>
                  ))}
                </select>
              )}

              {!showAddressForm && (
                <button
                  type="button"
                  className="add-address-button"
                  onClick={() => setShowAddressForm(true)}
                >
                  + Add New Address
                </button>
              )}

              {showAddressForm && (
                <form
                  className="cart-address-form"
                  onSubmit={handleAddAddress}
                >
                  <h4>Add Delivery Address</h4>

                  <label>
                    Full Name *
                    <input
                      name="name"
                      value={addressForm.name}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <label>
                    Phone Number *
                    <input
                      name="phone"
                      type="tel"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <label>
                    Address Line 1 *
                    <textarea
                      name="address_line1"
                      value={addressForm.address_line1}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <label>
                    Address Line 2
                    <input
                      name="address_line2"
                      value={addressForm.address_line2}
                      onChange={handleAddressChange}
                    />
                  </label>

                  <label>
                    City *
                    <input
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <label>
                    State *
                    <input
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <label>
                    Pincode *
                    <input
                      name="pincode"
                      value={addressForm.pincode}
                      onChange={handleAddressChange}
                      required
                    />
                  </label>

                  <label>
                    Landmark
                    <input
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleAddressChange}
                    />
                  </label>

                  <label>
                    Address Type
                    <select
                      name="address_type"
                      value={addressForm.address_type}
                      onChange={handleAddressChange}
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  <label className="address-default-checkbox">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressForm.is_default}
                      onChange={handleAddressChange}
                    />
                    Make this my default address
                  </label>

                  <div className="address-form-actions">
                    <button type="submit" disabled={savingAddress}>
                      {savingAddress ? "Saving..." : "Save Address"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setAddressForm(initialAddressForm);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="cart-payment-info">
              <h3>Payment Method</h3>
              <p>UPI (payment pending)</p>
              <small>
                Payment must be completed and verified separately.
              </small>
            </div>

            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={
                checkingOut ||
                items.length === 0 ||
                addresses.length === 0 ||
                !addressId ||
                showAddressForm
              }
            >
              {checkingOut ? "Placing Order..." : "Place Order"}
            </button>

            <button
              className="continue-shopping-button"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
