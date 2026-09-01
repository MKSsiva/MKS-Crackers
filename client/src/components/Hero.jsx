import { Link } from "react-router-dom";

const Hero = ({
  features = [],
  loading = false,
  error = false,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#080a18] text-white">

      {/* Background glow */}
      <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />

      <div className="absolute right-10 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      {/* Firework decoration */}
      <div className="absolute left-[45%] top-8 text-8xl opacity-80">
        🎆
      </div>

      <div className="absolute right-[25%] top-20 text-6xl">
        🎇
      </div>

      <div className="absolute right-10 top-40 text-7xl">
        🎆
      </div>

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:px-8">

        {/* ================================================= */}
        {/* LEFT CONTENT */}
        {/* ================================================= */}

        <div className="relative z-10">

          <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-orange-400">
            Premium Quality Crackers
          </p>

          <h1 className="text-5xl font-black leading-tight md:text-6xl">

            Celebrate

            <br />

            <span className="text-orange-400">
              Every Moment
            </span>

            <br />

            With Joy

          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Premium quality crackers for a safe, joyful
            and unforgettable celebration with your family.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/products"
              className="rounded-md bg-red-600 px-7 py-3 font-bold transition hover:bg-red-700"
            >
              SHOP NOW →
            </Link>

            <Link
              to="/offers"
              className="rounded-md border border-white/50 px-7 py-3 font-bold transition hover:bg-white hover:text-black"
            >
              EXPLORE OFFERS
            </Link>

          </div>

          {/* ================================================= */}
          {/* DYNAMIC HOMEPAGE FEATURES */}
          {/* ================================================= */}

          <div className="mt-10">

            {loading && (
              <div className="flex flex-wrap gap-4">

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-24 w-36 animate-pulse rounded-xl border border-white/20 bg-white/5"
                  />
                ))}

              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                Unable to load homepage features.
              </div>
            )}

            {!loading && !error && features.length > 0 && (
              <div className="flex max-w-2xl flex-wrap gap-4">

                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="min-w-[150px] flex-1 rounded-xl border border-white/30 bg-white/5 px-5 py-4 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
                  >

                    <div className="text-2xl">
                      {feature.icon}
                    </div>

                    <p className="mt-2 font-bold">
                      {feature.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {feature.description}
                    </p>

                  </div>
                ))}

              </div>
            )}

            {!loading && !error && features.length === 0 && (
              <div className="rounded-xl border border-white/20 bg-white/5 px-5 py-4 text-sm text-gray-400">
                No homepage features available.
              </div>
            )}

          </div>

        </div>

        {/* ================================================= */}
        {/* RIGHT PRODUCT SHOWCASE */}
        {/* ================================================= */}

        <div className="relative flex min-h-[400px] items-center justify-center">

          <div className="absolute h-80 w-80 rounded-full bg-red-500/10 blur-2xl" />

          <div className="relative text-center">

            <div className="mb-8 text-8xl">
              🎆
            </div>

            <div className="relative mx-auto w-72 rounded-2xl border border-orange-400/30 bg-gradient-to-br from-red-700 via-red-900 to-purple-900 p-8 shadow-2xl">

              <p className="text-sm font-bold uppercase tracking-widest text-orange-300">
                MKS
              </p>

              <h2 className="mt-3 text-4xl font-black text-yellow-300">
                Celebration
              </h2>

              <p className="mt-3 text-xl font-bold">
                GIFT BOX
              </p>

              <div className="mt-6 flex justify-center gap-3 text-5xl">
                🎇 🧨 🎆
              </div>

            </div>

            <div className="mt-6 flex justify-center gap-4 text-5xl">
              🧨 🚀 🧨
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;