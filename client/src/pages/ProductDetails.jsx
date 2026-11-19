
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setSuccess("");
        setQuantity(1);

        const [productResponse, imagesResponse] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/product-images/product/${id}`),
        ]);

        const productData = productResponse?.data ?? productResponse;
        const imagesData = imagesResponse?.data ?? imagesResponse;

        if (!productData.success || !productData.product) {
          throw new Error("Product not found.");
        }

        const currentProduct = productData.product;
        setProduct(currentProduct);

        const productImages = Array.isArray(imagesData.images)
          ? [...imagesData.images].sort(
              (a, b) => Number(b.is_primary) - Number(a.is_primary)
            )
          : [];

        setImages(productImages);
        setSelectedImage(productImages[0]?.image_url || "");
      } catch (err) {
        console.error("Product details error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load product details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const stock = Number(product?.stock_quantity || 0);
  const price = Number(product?.sale_price ?? product?.price ?? 0);
  const originalPrice = Number(product?.price || 0);
  const hasDiscount =
    product?.sale_price !== null &&
    product?.sale_price !== undefined &&
    Number(product.sale_price) < originalPrice;

  const increaseQuantity = () => {
    setQuantity((current) => Math.min(current + 1, stock));
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(current - 1, 1));
  };

  const handleQuantityChange = (event) => {
    const value = Number(event.target.value);

    if (!Number.isFinite(value)) return;

    setQuantity(Math.min(Math.max(1, Math.floor(value)), Math.max(stock, 1)));
  };

  const handleAddToCart = async () => {
    setSuccess("");
    setError("");

    if (!localStorage.getItem("token")) {
      setError("Please login to add products to your cart.");
      return;
    }

    if (!product || stock < 1) {
      setError("This product is currently out of stock.");
      return;
    }

    if (quantity > stock) {
      setError(`Only ${stock} items are available.`);
      return;
    }

    try {
      setAddingToCart(true);

      const response = await api.post("/cart", {
        product_id: product.id,
        quantity,
      });

      const data = response?.data ?? response;

      if (data.success === false) {
        throw new Error(data.message || "Unable to add product to cart.");
      }

      setSuccess(data.message || "Product added to your cart successfully!");
    } catch (err) {
      console.error("Add to cart error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-message">
        <div className="product-details-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-details-message">
        <p className="product-details-error">{error}</p>
        <Link to="/products" className="back-products-button">
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-details-layout">
          <section className="product-gallery">
            <div className="product-main-image">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} />
              ) : (
                <div className="product-no-image">
                  <span>📦</span>
                  <p>No product image available</p>
                </div>
              )}

              {hasDiscount && (
                <span className="product-discount-badge">
                  {Math.round(
                    ((originalPrice - price) / originalPrice) * 100
                  )}
                  % OFF
                </span>
              )}
            </div>

            {images.length > 0 && (
              <div className="product-image-thumbnails">
                {images.map((image) => (
                  <button
                    type="button"
                    key={image.id}
                    className={`product-thumbnail ${
                      selectedImage === image.image_url ? "selected" : ""
                    }`}
                    onClick={() => setSelectedImage(image.image_url)}
                    aria-label={`View image of ${product.name}`}
                  >
                    <img src={image.image_url} alt={product.name} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="product-information">
            <p className="product-category">
              {product.category_name || "MKS Crackers"}
            </p>

            <h1>{product.name}</h1>

            <p className="product-sku">
              Product SKU: {product.sku?.trim() || "N/A"}
            </p>

            <div className="product-detail-prices">
              <span className="product-detail-current-price">
                ₹{price.toFixed(2)}
              </span>

              {hasDiscount && (
                <>
                  <span className="product-detail-original-price">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                  <span className="product-save-text">
                    You save ₹{(originalPrice - price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <div className="product-detail-divider"></div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>
                {product.description ||
                  "Enjoy your celebrations with MKS Crackers premium quality products."}
              </p>
            </div>

            <div className="product-detail-meta">
              <p>
                <strong>Category:</strong>{" "}
                {product.category_name || "General"}
              </p>
              <p>
                <strong>Unit:</strong> {product.unit || "Piece"}
              </p>
              {product.weight && (
                <p>
                  <strong>Weight:</strong> {product.weight}
                </p>
              )}
            </div>

            <div className="product-stock-information">
              {stock > 0 ? (
                <span className="detail-in-stock">
                  ✓ In Stock ({stock} available)
                </span>
              ) : (
                <span className="detail-out-of-stock">Out of Stock</span>
              )}
            </div>

            {stock > 0 && (
              <div className="product-quantity-section">
                <label htmlFor="product-quantity">Quantity</label>

                <div className="product-quantity-control">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    max={stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                  />

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= stock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <span className="product-quantity-unit">
                  {product.unit || "items"}
                </span>
              </div>
            )}

            {stock > 0 && (
              <p className="product-subtotal">
                Subtotal: <strong>₹{(price * quantity).toFixed(2)}</strong>
              </p>
            )}

            {error && <p className="product-detail-error">{error}</p>}
            {success && <p className="product-detail-success">{success}</p>}

            <div className="product-detail-actions">
              <button
                type="button"
                className="detail-add-cart-button"
                onClick={handleAddToCart}
                disabled={stock < 1 || addingToCart}
              >
                {stock < 1
                  ? "Out of Stock"
                  : addingToCart
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

              <Link to="/cart" className="detail-view-cart-button">
                View Cart
              </Link>
            </div>

            <Link to="/products" className="continue-shopping-link">
              ← Continue Shopping
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
