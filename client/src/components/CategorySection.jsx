import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCategories } from "../services/api";

const fallbackIcons = [
  "✨",
  "🪔",
  "🚀",
  "🎁",
  "🎆",
];

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getCategories();

        if (
          response.success &&
          Array.isArray(response.categories)
        ) {
          setCategories(response.categories);
        } else {
          setCategories([]);
          setError(true);
        }
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );

        setCategories([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-7xl">

        {/* =========================================
            SECTION HEADER
        ========================================= */}

        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black text-[#10142d] md:text-4xl">
            SHOP BY CATEGORY
          </h2>

          <div className="mx-auto mt-3 h-1 w-12 bg-red-600" />
        </div>

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="h-44 animate-pulse bg-gray-100" />

                <div className="space-y-3 p-5">
                  <div className="mx-auto h-5 w-28 animate-pulse rounded bg-gray-100" />

                  <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* =========================================
            ERROR
        ========================================= */}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-8 text-center">
            <p className="font-semibold text-red-600">
              Unable to load categories.
            </p>

            <p className="mt-1 text-sm text-red-500">
              Please try again later.
            </p>
          </div>
        )}

        {/* =========================================
            CATEGORIES
        ========================================= */}

        {!loading &&
          !error &&
          categories.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

              {categories.map((category, index) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  {/* Category Image */}
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">

                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="text-7xl transition duration-300 group-hover:scale-110">
                        {fallbackIcons[
                          index % fallbackIcons.length
                        ]}
                      </div>
                    )}

                  </div>

                  {/* Category Information */}
                  <div className="p-5 text-center">

                    <h3 className="text-lg font-bold text-gray-800">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Explore Products
                    </p>

                  </div>

                </Link>
              ))}

            </div>
          )}

        {/* =========================================
            NO CATEGORIES
        ========================================= */}

        {!loading &&
          !error &&
          categories.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-8 text-center">
              <p className="font-semibold text-gray-600">
                No categories available.
              </p>
            </div>
          )}

      </div>
    </section>
  );
};

export default CategorySection;

