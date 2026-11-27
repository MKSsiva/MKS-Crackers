import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [addedId, setAddedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
        const data = response?.data ?? response;

        if (!data?.success || !Array.isArray(data.products)) {
          throw new Error(data?.message || "Unable to load products.");
        }

        const activeProducts = data.products.filter(
          (product) => product.status === "active"
        );

        const featuredProducts = activeProducts.filter(
          (product) =>
            product.featured === 1 ||
            product.featured === true ||
            product.featured === "1"
        );

        const displayProducts = (
          featuredProducts.length ? featuredProducts : activeProducts
        ).slice(0, 5);

        const productsWithImages = await Promise.all(
          displayProducts.map(async (product) => {
            try {
              const imageResponse = await api.get(
                `/product-images/product/${product.id}`
              );
              const imageData = imageResponse?.data ?? imageResponse;
              const images = imageData?.images || [];

              const primaryImage =
                images.find(
                  (image) =>
                    image.is_primary === 1 ||
                    image.is_primary === true ||
                    image.is_primary === "1"
                ) || images[0];

              return {
                ...product,
                image_url:
                  primaryImage?.image_url ||
                  product.image_url ||
                  product.image ||
                  null,
              };
            } catch (imageError) {
              console.error(
                `Image loading failed for product ${product.id}:`,
                imageError
              );

              return {
                ...product,
                image_url: product.image_url || product.image || null,
              };
            }
          })
        );

        if (!cancelled) setProducts(productsWithImages);
      } catch (err) {
        console.error("Homepage products error:", err);
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
            err.message ||
            "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();
    return () => { cancelled = true; };
  }, []);

  const handleAddToCart = async (product) => {
    const stock = Number(product.stock_quantity ?? product.stock ?? 0);

    if (stock <= 0) return;

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingId(product.id);
      setAddedId(null);

      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      setAddedId(product.id);
      window.setTimeout(() => {
        setAddedId((current) =>
          current === product.id ? null : current
        );
      }, 2200);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert(
        err.response?.data?.message ||
        "Unable to add this product to your cart."
      );
    } finally {
      setAddingId(null);
    }
  };

  const renderProductCard = (product) => {
    const price = Number(product.price || 0);
    const salePrice = Number(product.sale_price || 0);
    const hasSalePrice = salePrice > 0 && salePrice < price;
    const displayPrice = hasSalePrice ? salePrice : price;
    const stock = Number(product.stock_quantity ?? product.stock ?? 0);
    const discount = hasSalePrice
      ? Math.round(((price - salePrice) / price) * 100)
      : 0;

    const isAdding = addingId === product.id;
    const isAdded = addedId === product.id;
    const outOfStock = stock <= 0;
    const lowStock = stock > 0 && stock <= 5;

    return (
      <article
        key={product.id}
        className="mks-glass mks-3d-card group overflow-hidden rounded-3xl"
      >
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 p-5">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-orange-500/10 blur-2xl" />

          {hasSalePrice && (
            <span className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 text-xs font-black text-white shadow-lg">
              {discount}% OFF
            </span>
          )}

          {outOfStock && (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-slate-700 px-3 py-1.5 text-xs font-bold text-white">
              Sold Out
            </span>
          )}

          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="mks-product-image relative h-full w-full object-contain drop-shadow-2xl"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                const fallback = event.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = "block";
              }}
            />
          ) : null}

          <span
            className="relative text-7xl"
            style={{ display: product.image_url ? "none" : "block" }}
          >
            🎆
          </span>

          <Link
            to={`/products/${product.id}`}
            className="absolute bottom-3 right-3 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
          >
            Quick View ↗
          </Link>
        </div>

        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-orange-300">
            {product.category_name || "MKS Crackers"}
          </p>

          <h3 className="mt-2 min-h-12 text-lg font-extrabold leading-snug text-white">
            {product.name}
          </h3>

          {product.weight && (
            <p className="mt-1 text-xs text-slate-400">
              Weight: {product.weight}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {outOfStock ? (
              <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-300">
                ● Out of Stock
              </span>
            ) : lowStock ? (
              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-300">
                ● Only {stock} left
              </span>
            ) : (
              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                ● In Stock
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-black text-orange-300">
              ₹{displayPrice.toFixed(2)}
            </span>

            {hasSalePrice && (
              <span className="text-sm text-slate-500 line-through">
                ₹{price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product.id}`}
              className="rounded-xl border border-white/15 px-3 py-3 text-center text-sm font-bold text-white transition hover:border-orange-300 hover:bg-white/5"
            >
              View Details
            </Link>

            <button
              type="button"
              disabled={outOfStock || isAdding}
              onClick={() => handleAddToCart(product)}
              className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                outOfStock
                  ? "cursor-not-allowed bg-slate-700 text-slate-400"
                  : isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-900/20 hover:-translate-y-1 hover:shadow-orange-500/30"
              }`}
            >
              {isAdding
                ? "Adding..."
                : isAdded
                  ? "✓ Added!"
                  : outOfStock
                    ? "Unavailable"
                    : "+ Add to Cart"}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="relative overflow-hidden bg-[#080d20] px-6 py-20 text-white">
      <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.3em] text-orange-300">
              Handpicked for your celebrations
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              BEST SELLING <span className="mks-gradient-text">PRODUCTS</span>
            </h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-300" />
            <p className="mt-4 text-sm text-slate-400">
              Discover our premium collection at special prices.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-xl border border-orange-400/40 px-5 py-3 text-sm font-bold text-orange-300 transition hover:bg-orange-500 hover:text-white"
          >
            View All Products →
          </Link>
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mks-glass overflow-hidden rounded-3xl p-3">
                <div className="mks-shimmer h-56 rounded-2xl" />
                <div className="space-y-3 p-3">
                  <div className="mks-shimmer h-3 w-1/3 rounded" />
                  <div className="mks-shimmer h-5 rounded" />
                  <div className="mks-shimmer h-5 w-1/2 rounded" />
                  <div className="mks-shimmer h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <p className="font-bold text-red-300">Unable to load products.</p>
            <p className="mt-2 text-sm text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map(renderProductCard)}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-12 text-center">
            <div className="text-5xl">🎆</div>
            <p className="mt-4 font-bold text-white">
              Products coming soon!
            </p>
            <Link to="/products" className="mt-4 inline-block font-bold text-orange-300">
              Browse Products →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
