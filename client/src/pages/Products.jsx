
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Products.css";

const getProductImage = (product) => {
  if (product.primary_image) return product.primary_image;
  if (product.primary_image_url) return product.primary_image_url;
  if (product.image_url) return product.image_url;

  if (Array.isArray(product.images) && product.images.length > 0) {
    const primary =
      product.images.find((image) => image.is_primary) ||
      product.images[0];

    return typeof primary === "string"
      ? primary
      : primary.image_url || primary.url || "";
  }

  return "";
};

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const [productResponse, categoryResponse] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      const productData = productResponse.data ?? productResponse;
      const categoryData = categoryResponse.data ?? categoryResponse;

      if (!productData.success) {
        throw new Error(
          productData.message || "Unable to load products."
        );
      }

      const activeProducts = (productData.products || []).filter(
        (product) => product.status === "active"
      );

      const activeCategories = (categoryData.categories || []).filter(
        (category) => category.status === "active"
      );

      setProducts(activeProducts);
      setCategories(activeCategories);
    } catch (err) {
      console.error("Customer products loading error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        String(product.category_id) === String(selectedCategory);

      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search) ||
        product.category_name?.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = async (product) => {
    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to add products to your cart.");
      return;
    }

    if (Number(product.stock_quantity) <= 0) {
      setError("Sorry, this product is currently out of stock.");
      return;
    }

    try {
      setAddingProductId(product.id);

      const response = await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      const data = response.data ?? response;

      if (!data.success) {
        throw new Error(data.message || "Unable to add product to cart.");
      }

      setMessage(`${product.name} added to your cart successfully.`);
    } catch (err) {
      console.error("Add to cart error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <>
      <Header />

      <main className="customer-products-page">
        <section className="products-heading">
          <span className="products-eyebrow">MKS CRACKERS</span>

          <h1>Our Products</h1>

          <p>
            Explore our collection of quality crackers and make
            every celebration special.
          </p>
        </section>

        <section className="products-toolbar">
          <div className="products-search">
            <span className="search-icon">⌕</span>
            <input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="view-cart-button"
            onClick={() => navigate("/cart")}
          >
            <span>🛒</span> View Cart
          </button>
        </section>

        <section className="products-category-list">
          <button
            type="button"
            className={
              selectedCategory === "all"
                ? "category-filter active"
                : "category-filter"
            }
            onClick={() => setSelectedCategory("all")}
          >
            All Products
          </button>

          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              className={
                String(selectedCategory) === String(category.id)
                  ? "category-filter active"
                  : "category-filter"
              }
              onClick={() => setSelectedCategory(String(category.id))}
            >
              {category.name}
            </button>
          ))}
        </section>

        {error && (
          <div className="products-alert products-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="products-alert products-success" role="status">
            {message}
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="message-cart-link"
            >
              View Cart
            </button>
          </div>
        )}

        <section className="products-results">
          <div className="products-results-heading">
            <h2>
              {selectedCategory === "all"
                ? "All Products"
                : categories.find(
                    (category) =>
                      String(category.id) === String(selectedCategory)
                  )?.name || "Products"}
            </h2>

            <span>
              {loading
                ? "Loading..."
                : `${filteredProducts.length} products`}
            </span>
          </div>

          {loading ? (
            <div className="products-loading">
              <div className="products-spinner" />
              <p>Loading our products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="products-empty">
              <div className="empty-icon">🎆</div>
              <h3>No products found</h3>
              <p>
                Try another category or search with a different product name.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchTerm("");
                }}
              >
                Show All Products
              </button>
            </div>
          ) : (
            <div className="customer-products-grid">
              {filteredProducts.map((product) => {
                const image = getProductImage(product);
                const price = Number(product.price || 0);
                const salePrice =
                  product.sale_price === null ||
                  product.sale_price === undefined ||
                  product.sale_price === ""
                    ? null
                    : Number(product.sale_price);

                const hasSale =
                  salePrice !== null &&
                  salePrice > 0 &&
                  salePrice < price;

                const stock = Number(product.stock_quantity || 0);
                const isAdding = addingProductId === product.id;

                return (
                  <article
                    className="customer-product-card"
                    key={product.id}
                  >
                    <div className="customer-product-image">
                      {hasSale && (
                        <span className="product-sale-badge">
                          SALE
                        </span>
                      )}

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }}
                        />
                      ) : null}

                      <div
                        className="product-image-placeholder"
                        style={{ display: image ? "none" : "flex" }}
                      >
                        <span>🎆</span>
                        <small>MKS Crackers</small>
                      </div>
                    </div>

                    <div className="customer-product-info">
                      <span className="customer-product-category">
                        {product.category_name || "Crackers"}
                      </span>

                      <h3>{product.name}</h3>

                      {product.sku && (
                        <p className="customer-product-sku">
                          SKU: {product.sku}
                        </p>
                      )}

                      <div className="customer-product-pricing">
                        <strong>
                          ₹{formatPrice(hasSale ? salePrice : price)}
                        </strong>

                        {hasSale && (
                          <del>₹{formatPrice(price)}</del>
                        )}
                      </div>

                      <p
                        className={
                          stock > 0
                            ? "customer-product-stock in-stock"
                            : "customer-product-stock out-of-stock"
                        }
                      >
                        {stock > 0
                          ? `In Stock (${stock})`
                          : "Out of Stock"}
                      </p>

                      <button
                        type="button"
                        className="add-to-cart-button"
                        disabled={stock <= 0 || isAdding}
                        onClick={() => handleAddToCart(product)}
                      >
                        {isAdding
                          ? "Adding..."
                          : stock <= 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Products;
