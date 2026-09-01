import { Link } from "react-router-dom";

const products = [
  {
    name: "Electric Sparklers",
    quantity: "10 Pcs",
    price: "₹180",
    oldPrice: "₹250",
    rating: "120",
    icon: "✨",
  },
  {
    name: "Color Flower Pots",
    quantity: "5 Pcs",
    price: "₹250",
    oldPrice: "₹350",
    rating: "98",
    icon: "🪔",
  },
  {
    name: "Sky Rocket",
    quantity: "Pack of 5",
    price: "₹300",
    oldPrice: "₹450",
    rating: "76",
    icon: "🚀",
  },
  {
    name: "Deluxe Gift Box",
    quantity: "",
    price: "₹999",
    oldPrice: "₹1,499",
    rating: "64",
    icon: "🎁",
  },
  {
    name: "Mega Celebration Pack",
    quantity: "",
    price: "₹1,499",
    oldPrice: "₹2,250",
    rating: "110",
    icon: "🎆",
  },
];

const ProductSection = () => {
  return (
    <section className="bg-gray-50 px-6 py-16">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-center justify-between">

          <h2 className="text-3xl font-black text-[#10142d] md:text-4xl">
            BEST SELLING PRODUCTS
          </h2>

          <Link
            to="/products"
            className="hidden font-semibold text-red-600 sm:block"
          >
            View All Products →
          </Link>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {products.map((product) => (
            <div
              key={product.name}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Product Image */}
              <div className="relative flex h-52 items-center justify-center bg-gray-50">

                <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-1 text-xs font-bold text-white">
                  Sale
                </span>

                <span className="text-8xl transition group-hover:scale-110">
                  {product.icon}
                </span>

              </div>

              {/* Product Details */}
              <div className="p-4">

                <h3 className="font-bold text-gray-800">
                  {product.name}
                  {product.quantity && ` (${product.quantity})`}
                </h3>

                <div className="mt-2 text-sm text-yellow-500">
                  ★★★★☆{" "}
                  <span className="text-gray-400">
                    ({product.rating})
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">

                  <div>
                    <span className="text-xl font-black text-red-600">
                      {product.price}
                    </span>

                    <span className="ml-2 text-sm text-gray-400 line-through">
                      {product.oldPrice}
                    </span>
                  </div>

                  <button className="rounded-lg border border-red-500 px-3 py-2 text-red-600 transition hover:bg-red-600 hover:text-white">
                    🛒
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ProductSection;