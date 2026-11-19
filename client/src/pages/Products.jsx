import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch products, categories and their images
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, categoriesResponse] =
          await Promise.all([
            api.get("/products"),
            api.get("/categories"),
          ]);

        const productsData =
          productsResponse.data ?? productsResponse;

        const categoriesData =
          categoriesResponse.data ?? categoriesResponse;

        if (!productsData.success) {
          throw new Error(
            productsData.message || "Unable to load products."
          );
        }

        const activeProducts = (productsData.products || []).filter(
          (product) => product.status === "active"
        );

        setProducts(activeProducts);
        setCategories(categoriesData.categories || []);

        // Fetch Cloudinary images for each product
        const imageResults = await Promise.allSettled(
          activeProducts.map((product) =>
            api.get(`/product-images/product/${product.id}`)
          )
        );

        const imageMap = {};

        imageResults.forEach((result, index) => {
          if (result.status !== "fulfilled") return;

          const response = result.value.data ?? result.value;
          const images = response.images || [];

          const primaryImage =
            images.find((image) => image.is_primary) || images[0];

          if (primaryImage?.image_url) {
            imageMap[activeProducts[index].id] =
              primaryImage.image_url;
          }
        });

        setProductImages(imageMap);
      } catch (err) {
        console.error("Product loading error:", err);

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Category filtering
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }

    return products.filter(
      (product) =>
        String(product.category_id) === String(selectedCategory)
    );
  }, [products, selectedCategory]);

  // Add product to cart
  const handleAddToCart = async (product) => {
    try {
      setAddingProduct(product.id);
      setMessage("");
      setError("");

      if (!localStorage.getItem("token")) {
        setError("Please login to add products to your cart.");
        return;
      }

      if (Number(product.stock_quantity) <= 0) {
        setError("This product is currently out of stock.");
        return;
      }

      const response = await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      const data = response.data ?? response;

      if (data.success) {
        setMessage(`${product.name} added to cart successfully!`);
      } else {
        setError(data.message || "Unable to add product to cart.");
      }
    } catch (err) {
      console.error("Add to cart error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to add product. Please try again."
      );
    } finally {
      setAddingProduct(null);
    }
  };

  const getProductPrice = (product) => {
    return Number(product.sale_price ?? product.price ?? 0);
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="products-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">

        <div className="products-heading">
          <div>
            <h1>Our Products</h1>
            <p>
              Discover quality crackers for every celebration.
            </p>
          </div>

          <Link to="/cart" className="view-cart-button">
            🛒 View Cart
          </Link>
        </div>

        {message && (
          <div className="products-success">
            {message}
          </div>
        )}

        {error && (
          <div className="products-error">
            {error}
          </div>
        )}

        {/* Category Filter */}
        <div className="category-filters">
          <button
            className={
              selectedCategory === "all" ? "active" : ""
            }
            onClick={() => setSelectedCategory("all")}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              className={
                String(selectedCategory) === String(category.id)
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(String(category.id))
              }
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Listing */}
        {filteredProducts.length === 0 ? (
          <div className="products-empty">
            <h2>No Products Found</h2>
            <p>There are no products in this category.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => {
              const price = getProductPrice(product);
              const originalPrice = Number(product.price || 0);
              const stock = Number(product.stock_quantity || 0);
              const outOfStock = stock <= 0;

              return (
                <div className="product-card" key={product.id}>

                  <Link
                    to={`/products/${product.id}`}
                    className="product-image-link"
                  >
                    {productImages[product.id] ? (
                      <img
                        src={productImages[product.id]}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        🎆
                        <span>No Image Available</span>
                      </div>
                    )}

                    {product.featured === 1 ||
                    product.featured === true ? (
                      <span className="featured-badge">
                        Featured
                      </span>
                    ) : null}
                  </Link>

                  <div className="product-card-content">

                    <h3>{product.name}</h3>

                    {product.sku && (
                      <p className="product-sku">
                        SKU: {product.sku}
                      </p>
                    )}

                    <div className="product-prices">
                      <span className="current-price">
                        ₹{price.toFixed(2)}
                      </span>

                      {originalPrice > price && (
                        <span className="original-price">
                          ₹{originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <p
                      className={
                        outOfStock
                          ? "stock-status out-of-stock"
                          : stock <= 5
                          ? "stock-status low-stock"
                          : "stock-status in-stock"
                      }
                    >
                      {outOfStock
                        ? "Out of Stock"
                        : stock <= 5
                        ? `Only ${stock} left`
                        : "In Stock"}
                    </p>

                    <div className="product-card-actions">
                      <Link
                        to={`/products/${product.id}`}
                        className="details-button"
                      >
                        View Details
                      </Link>

                      <button
                        className="add-cart-button"
                        disabled={
                          outOfStock ||
                          addingProduct === product.id
                        }
                        onClick={() => handleAddToCart(product)}
                      >
                        {addingProduct === product.id
                          ? "Adding..."
                          : outOfStock
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
