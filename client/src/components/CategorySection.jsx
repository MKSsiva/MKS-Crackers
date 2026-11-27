import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/api";

const fallbackIcons = ["✨", "🪔", "🚀", "🎁", "🎆", "🌟"];

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getCategories();
        const data = response?.data ?? response;

        if (!data?.success || !Array.isArray(data.categories)) {
          throw new Error("Unable to load categories.");
        }

        if (!cancelled) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Category loading error:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCategories();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#0c1328] px-6 py-20 text-white">
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[90px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[.3em] text-orange-300">
            Find your favourites
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            SHOP BY <span className="mks-gradient-text">CATEGORY</span>
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-300" />
          <p className="mt-4 text-sm text-slate-400">
            Explore our collection for every special occasion.
          </p>
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="mks-glass overflow-hidden rounded-3xl p-4">
                <div className="mks-shimmer h-40 rounded-2xl" />
                <div className="mks-shimmer mx-auto mt-5 h-5 w-2/3 rounded" />
                <div className="mks-shimmer mx-auto mt-3 h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center text-red-200">
            Unable to load categories. Please refresh the page.
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.slug)}`}
                className="mks-glass mks-3d-card group overflow-hidden rounded-3xl p-3"
              >
                <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/15 via-slate-800 to-yellow-500/10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="relative h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="mks-float relative text-7xl">
                      {fallbackIcons[index % fallbackIcons.length]}
                    </span>
                  )}
                </div>

                <div className="px-2 py-5 text-center">
                  <h3 className="font-bold text-white transition group-hover:text-orange-300">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-orange-300">
                    Explore collection →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
            No categories available at the moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
