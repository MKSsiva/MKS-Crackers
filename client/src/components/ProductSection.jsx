
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
        const data = response.data ?? response;

        if (!data.success || !Array.isArray(data.products)) {
          throw new Error(data.message || "Unable to load products.");
        }

        const activeProducts = data.products.filter(
          (product) => product.status === "active"
        );

        // Show featured products first.
        // If none are featured, show the latest active products.
        const featuredProducts = activeProducts.filter(
          (product) =>
            product.featured === 1 ||
            product.featured === true
        );

        const displayProducts = (
          featuredProducts.length > 0
            ? featuredProducts
            : activeProducts
        ).slice(0, 5);

        // Fetch images from the existing product-image API.
        const productsWithImages = await Promise.all(
          displayProducts.map(async (product) => {
            try {
              const imageResponse = await api.get(
                `/product-images/product/${product.id}`
              );

              const imageData =
                imageResponse.data ?? imageResponse;

              const images = imageData.images || [];

              const primaryImage =
                images.find(
                  (image) =>
                    image.is_primary === 1 ||
                    image.is_primary === true
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
                `Failed to load image for product ${product.id}:`,
                imageError
              );

              return {
                ...product,
                image_url:
                  product.image_url ||
                  product.image ||
                  null,
              };
            }
          })
        );

        if (!cancelled) {
          setProducts(productsWithImages);
        }
      } catch (error) {
        console.error("Homepage products error:", error);

        if (!cancelled) {
          setError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderProductCard = (product) => {
    const price = Number(product.price || 0);
    const salePrice = Number(product.sale_price || 0);

    const hasSalePrice =
      salePrice > 0 && salePrice < price;

    const displayPrice = hasSalePrice
      ? salePrice
      : price;

    return (
      <div
        key={product.id}
        className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Product Image */}
        <Link
          to="/products"
          className="relative flex h-52 items-center justify-center overflow-hidden bg-gray-50"
        >
          {hasSalePrice && (
            <span className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
              Sale
            </span>
          )}

          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-110"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span className="text-8xl transition duration-300 group-hover:scale-110">
              🎆
            </span>
          )}
        </Link>

        {/* Product Details */}
        <div className="p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {product.category_name || "MKS Crackers"}
          </p>

          <h3 className="min-h-12 font-bold text-gray-800">
            {product.name}
          </h3>

          {product.weight && (
            <p className="mt-1 text-xs text-gray-500">
              Weight: {product.weight}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <span className="text-xl font-black text-red-600">
                ₹{displayPrice.toFixed(2)}
              </span>

              {hasSalePrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ₹{price.toFixed(2)}
                </span>
              )}
            </div>

            <Link
              to="/products"
              className="rounded-lg border border-red-500 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              View
            </Link>
          </div>

          {Number(product.stock_quantity) <= 0 && (
            <p className="mt-3 text-xs font-semibold text-red-600">
              Out of stock
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#10142d] md:text-4xl">
              BEST SELLING PRODUCTS
            </h2>

            <div className="mt-3 h-1 w-12 bg-red-600" />

            <p className="mt-3 text-sm text-gray-500">
              Explore our premium quality crackers.
            </p>
          </div>

          <Link
            to="/products"
            className="font-semibold text-red-600 transition hover:text-red-800"
          >
            View All Products →
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white"
              >
                <div className="h-52 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-7 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
            <p className="font-semibold text-red-600">
              Unable to load products.
            </p>

            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {products.map(renderProductCard)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center">
            <p className="font-semibold text-gray-600">
              No products available at the moment.
            </p>

            <Link
              to="/products"
              className="mt-4 inline-block font-semibold text-red-600"
            >
              Browse Products →
            </Link>
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductSection;
