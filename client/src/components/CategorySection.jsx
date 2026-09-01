import { Link } from "react-router-dom";

const categories = [
  {
    name: "Sparklers",
    icon: "✨",
    count: "25+ Products",
  },
  {
    name: "Flower Pots",
    icon: "🪔",
    count: "40+ Products",
  },
  {
    name: "Rockets",
    icon: "🚀",
    count: "30+ Products",
  },
  {
    name: "Gift Boxes",
    icon: "🎁",
    count: "20+ Products",
  },
  {
    name: "Assorted Items",
    icon: "🎆",
    count: "50+ Products",
  },
];

const CategorySection = () => {
  return (
    <section className="bg-white px-6 py-16">

      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">

          <h2 className="text-3xl font-black text-[#10142d] md:text-4xl">
            SHOP BY CATEGORY
          </h2>

          <div className="mx-auto mt-3 h-1 w-12 bg-red-600" />

        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {categories.map((category) => (
            <Link
              key={category.name}
              to="/products"
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 text-7xl transition group-hover:scale-110">
                {category.icon}
              </div>

              <div className="p-5 text-center">

                <h3 className="text-lg font-bold text-gray-800">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {category.count}
                </p>

              </div>

            </Link>
          ))}

        </div>
      </div>
    </section>
  );
};

export default CategorySection;