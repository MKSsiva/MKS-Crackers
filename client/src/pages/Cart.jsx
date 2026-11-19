
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

const unwrap = (response) => response?.data ?? response;

const getCartItems = (response) => {
  const data = unwrap(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.cart)) return data.cart;
  if (Array.isArray(data?.cart?.items)) return data.cart.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.cart)) return data.data.cart;

  return [];
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
  const [clearingCart, setClearingCart] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const getItemId = (item) => item.id ?? item.cart_id;

  const getProductId = (item) =>
    item.product_id ?? item.product?.id;

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
    item.product_name || item.name || item.product?.name || "Product";

  const getItemImage = (item) =>
    item.primary_image ||
    item.image_url ||
    item.product_image ||
    item.product?.primary_image ||
    "";

  const getItemSku = (item) =>
    item.sku || item.product_sku || item.product?.sku || "";

  const getItemStock = (item) => {
    const value = item.stock_quantity ?? item.product?.stock_quantity;
    return value === null || value === undefined ? null : Number(value);
  };

  const loadCartOnly = async () => {
    const response = await getCart();
    const cartItems = getCartItems(response);

    // Load product-specific Cloudinary images if the cart response
    // does not already contain an image.
    const itemsWithImages = await Promise.all(
      cartItems.map(async (item) => {
        if (getItemImage(item)) return item;

        const productId = getProductId(item);
        if (!productId) return item;

        try {
          const imageResponse = await api.get(
            `/product-images/product/${productId}`
          );
          const imageData = unwrap(imageResponse);
          const productImages = Array.isArray(imageData.images)
            ? imageData.images
            : [];

          const primaryImage =
            productImages.find(
              (image) =>
                Number(image.is_primary) === 1 ||
                image.is_primary === true
            ) || productImages[0];

          return primaryImage
            ? { ...item, primary_image: primaryImage.image_url }
            : item;
        } catch (imageError) {
          console.error(
            `Unable to load image for product ${productId}:`,
            imageError
          );
          return item;
        }
      })
    );

    setItems(itemsWithImages);
  };

  const loadCartAndAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const [cartResponse, addressResponse] = await Promise.all([
        getCart(),
        api.get("/addresses"),
      ]);

      const cartItems = getCartItems(cartResponse);
      const addressData = unwrap(addressResponse);
      const addressList = Array.isArray(addressData.addresses)
        ? addressData.addresses
        : [];

      setAddresses(addressList);

      // Load product images when they are not included in cart results.
      const itemsWithImages = await Promise.all(
        cartItems.map(async (item) => {
          if (getItemImage(item)) return item;

          const productId = getProductId(item);
          if (!productId) return item;

          try {
            const imageResponse = await api.get(
              `/product-images/product/${productId}`
            );
            const imageData = unwrap(imageResponse);
            const productImages = Array.isArray(imageData.images)
              ? imageData.images
              : [];

            const primaryImage =
              productImages.find(
                (image) =>
                  Number(image.is_primary) === 1 ||
                  image.is_primary === true
              ) || productImages[0];

            return primaryImage
              ? { ...item, primary_image: primaryImage.image_url }
              : item;
          } catch {
            return item;
          }
        })
      );

      setItems(itemsWithImages);

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

  const subtotal = items.reduce(
    (total, item) =>
      total + getItemPrice(item) * Number(item.quantity || 0),
    0
  );

  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity || 0),
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

      const data = unwrap(response);

      if (data.success && data.address) {
        const newAddress = data.address;

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
        setError(data.message || "Unable to add address.");
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
    const stock = getItemStock(item);

    if (!Number.isInteger(quantity) || quantity < 1) return;

    if (stock !== null && quantity > stock) {
      setError(
        `Only ${stock} units are available for ${getItemName(item)}.`
      );
      return;
    }

    try {
      setError("");
      setMessage("");
      setUpdatingId(itemId);

      const response = await updateCartItem(itemId, quantity);
      const data = unwrap(response);

      if (data.success === false) {
        throw new Error(data.message || "Unable to update quantity.");
      }

      await loadCartOnly();
      setMessage("Cart quantity updated.");
    } catch (err) {
      console.error("Quantity update error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
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
      setMessage("");
      setUpdatingId(itemId);

      const response = await removeCartItem(itemId);
      const data = unwrap(response);

      if (data.success === false) {
        throw new Error(data.message || "Unable to remove item.");
      }

      await loadCartOnly();
      setMessage(`${getItemName(item)} removed from your cart.`);
    } catch (err) {
      console.error("Remove cart item error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to remove item."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (items.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to remove all products from your cart?"
    );

    if (!confirmed) return;

    try {
      setClearingCart(true);
      setError("");
      setMessage("");

      const response = await api.delete("/cart");
      const data = unwrap(response);

      if (data.success === false) {
        throw new Error(data.message || "Unable to clear cart.");
      }

      setItems([]);
      setMessage("All products have been removed from your cart.");
    } catch (err) {
      console.error("Clear cart error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to clear your cart."
      );
    } finally {
      setClearingCart(false);
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

      const data = unwrap(response);

      if (data.success) {
        setOrder(
          data.order ||
            data.data?.order ||
            data.data ||
            data
        );
        setItems([]);
      } else {
        setError(data.message || "Checkout failed.");
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
              {order.order_number ||
                order.orderNumber ||
                order.id ||
                "Placed"}
            </p>
            <p>
              <strong>Order Status:</strong>{" "}
              {order.status || "pending"}
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
            <div className="cart-items-header">
              <h2>
                Cart Items ({totalQuantity})
              </h2>

              <button
                type="button"
                className="clear-cart-button"
                onClick={handleClearCart}
                disabled={clearingCart || updatingId !== null}
              >
                {clearingCart ? "Clearing..." : "Clear Cart"}
              </button>
            </div>

            {items.map((item) => {
              const itemId = getItemId(item);
              const image = getItemImage(item);
              const price = getItemPrice(item);
              const quantity = Number(item.quantity || 1);
              const stock = getItemStock(item);
              const isUpdating = updatingId === itemId;

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

                    {getItemSku(item) && (
                      <p className="cart-item-sku">
                        SKU: {getItemSku(item).trim()}
                      </p>
                    )}

                    <p className="cart-item-price">
                      ₹{price.toFixed(2)} each
                    </p>

                    {stock !== null && (
                      <p className="cart-item-stock">
                        {stock > 0
                          ? `${stock} available`
                          : "Out of stock"}
                      </p>
                    )}

                    <div className="cart-quantity">
                      <button
                        type="button"
                        disabled={isUpdating || quantity <= 1}
                        onClick={() =>
                          handleQuantityChange(item, quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{isUpdating ? "..." : quantity}</span>

                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          (stock !== null && quantity >= stock)
                        }
                        onClick={() =>
                          handleQuantityChange(item, quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-cart-item"
                      disabled={isUpdating || clearingCart}
                      onClick={() => handleRemoveItem(item)}
                    >
                      {isUpdating ? "Updating..." : "Remove"}
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
              <span>Products</span>
              <span>{items.length}</span>
            </div>

            <div className="cart-summary-row">
              <span>Total Quantity</span>
              <span>{totalQuantity}</span>
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
              type="button"
              className="checkout-button"
              onClick={handleCheckout}
              disabled={
                checkingOut ||
                clearingCart ||
                updatingId !== null ||
                items.length === 0 ||
                addresses.length === 0 ||
                !addressId ||
                showAddressForm
              }
            >
              {checkingOut ? "Placing Order..." : "Place Order"}
            </button>

            <button
              type="button"
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
