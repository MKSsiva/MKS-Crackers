import { Link } from "react-router-dom";

const Hero = ({
  hero = null,
  features = [],
  loading = false,
  error = false,
}) => {
  const primaryLink = hero?.primary_button_link || "/products";
  const secondaryLink = hero?.secondary_button_link || "/offers";

  return (
    <section className="mks-hero relative isolate overflow-hidden bg-[#080914] text-white">

      {/* =========================================
          BACKGROUND EFFECTS
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        <div className="mks-glow absolute -left-32 top-10 h-96 w-96 rounded-full bg-orange-600/20 blur-[100px]" />

        <div className="mks-glow absolute right-0 top-20 h-96 w-96 rounded-full bg-purple-600/20 blur-[110px]" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-red-600/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

      </div>

      {/* =========================================
          FLOATING PARTICLES
      ========================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <span className="mks-float absolute left-[8%] top-[15%] text-3xl opacity-60">
          ✨
        </span>

        <span
          className="mks-float absolute right-[12%] top-[12%] text-5xl opacity-70"
          style={{ animationDelay: "1s" }}
        >
          🎆
        </span>

        <span
          className="mks-float absolute left-[48%] top-[8%] text-3xl opacity-50"
          style={{ animationDelay: "2s" }}
        >
          ✦
        </span>

        <span
          className="mks-float absolute bottom-[18%] left-[5%] text-4xl opacity-50"
          style={{ animationDelay: "1.5s" }}
        >
          ✨
        </span>

        <span
          className="mks-float absolute bottom-[12%] right-[8%] text-4xl opacity-60"
          style={{ animationDelay: ".7s" }}
        >
          🎇
        </span>

        <span className="mks-firework-dot left-[25%] top-[30%]" />
        <span className="mks-firework-dot right-[30%] top-[45%]" />
        <span className="mks-firework-dot bottom-[25%] left-[55%]" />

      </div>

      {/* =========================================
          MAIN HERO CONTENT
      ========================================= */}

      <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

        {/* LEFT CONTENT */}

        <div className="relative z-10">

          {/* Premium badge */}

          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-2.5 backdrop-blur-xl">

            <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />

            <span className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
              {hero?.badge || "Premium Quality Crackers"}
            </span>

          </div>

          {/* Dynamic heading */}

          <h1 className="text-5xl font-black leading-[1.12] tracking-tight sm:text-6xl lg:text-7xl">

            {hero?.title || (
              <>
                Celebrate Every

                <span className="mks-gradient-text block">
                  Moment With Joy
                </span>
              </>
            )}

          </h1>

          {/* Dynamic subtitle */}

          <p className="mt-7 max-w-xl text-base leading-8 text-gray-300 sm:text-lg">

            {hero?.subtitle ||
              "Premium quality crackers for a safe, joyful and unforgettable celebration with your family."}

          </p>

          {/* Dynamic CTA buttons */}

          <div className="mt-9 flex flex-wrap gap-4">

            <Link
              to={primaryLink}
              className="mks-glow-button group px-8 py-4"
            >
              {hero?.primary_button_text || "SHOP NOW"}

              <span className="text-xl transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to={secondaryLink}
              className="inline-flex items-center gap-3 rounded-xl border border-white/25 bg-white/[0.06] px-8 py-4 font-bold text-white backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:border-orange-300/70 hover:bg-orange-500/10"
            >
              {hero?.secondary_button_text || "EXPLORE OFFERS"}

              <span className="text-orange-300">✦</span>
            </Link>

          </div>

          {/* Dynamic homepage features */}

          <div className="mt-12">

            {loading && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="mks-glass h-28 animate-pulse rounded-2xl"
                  />
                ))}

              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                Unable to load homepage content. Default hero content is displayed.
              </div>
            )}

            {!loading && !error && features.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">

                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="mks-3d-card rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-xl"
                  >

                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-300/20 bg-gradient-to-br from-orange-400/20 to-red-500/10 text-2xl">
                      {feature.icon || "✨"}
                    </div>

                    <p className="font-bold text-white">
                      {feature.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      {feature.description}
                    </p>

                  </div>
                ))}

              </div>
            )}

            {!loading && !error && features.length === 0 && (
              <div className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-gray-400">
                No homepage features available.
              </div>
            )}

          </div>

        </div>

        {/* =========================================
            RIGHT 3D SHOWCASE
        ========================================= */}

        <div className="relative flex min-h-[440px] items-center justify-center">

          {/* Outer glow */}

          <div className="mks-glow absolute h-[350px] w-[350px] rounded-full bg-orange-500/15 blur-3xl sm:h-[440px] sm:w-[440px]" />

          {/* Rotating orbit */}

          <div className="mks-orbit absolute h-[350px] w-[350px] rounded-full border border-dashed border-orange-300/20 sm:h-[430px] sm:w-[430px]">

            <span className="absolute -top-3 left-1/2 text-3xl">
              ✨
            </span>

            <span className="absolute right-5 top-1/2 text-2xl">
              ✦
            </span>

            <span className="absolute bottom-5 left-10 text-2xl">
              ✧
            </span>

          </div>

          {/* 3D showcase */}

          <div className="relative z-10">

            {/* Floating left card */}

            <div className="mks-float absolute -left-12 top-4 z-20 rounded-2xl border border-orange-300/30 bg-[#171426]/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-20">

              <div className="text-3xl">🎆</div>

              <p className="mt-1 text-xs font-bold text-orange-200">
                CELEBRATE
              </p>

            </div>

            {/* Floating right card */}

            <div
              className="mks-float absolute -right-8 top-20 z-20 rounded-2xl border border-yellow-300/30 bg-[#171426]/90 p-4 shadow-2xl backdrop-blur-xl sm:-right-16"
              style={{ animationDelay: "1.2s" }}
            >

              <div className="text-3xl">🎇</div>

              <p className="mt-1 text-xs font-bold text-yellow-200">
                HAPPINESS
              </p>

            </div>

            {/* 3D gift box */}

            <div className="mks-3d-card mks-pulse-glow relative w-[270px] rounded-[28px] border border-orange-300/40 bg-gradient-to-br from-[#9f2028] via-[#5c142b] to-[#25123d] p-7 shadow-2xl sm:w-[330px] sm:p-9">

              <div className="absolute inset-2 rounded-[22px] border border-white/10" />

              <div className="relative z-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-200/30 bg-yellow-300/10 text-3xl shadow-lg">
                  ✨
                </div>

                <p className="mt-5 text-sm font-extrabold tracking-[0.45em] text-orange-200">
                  MKS CRACKERS
                </p>

                <div className="my-5 h-px bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent" />

                <h2 className="mks-gradient-text text-4xl font-black tracking-tight sm:text-5xl">
                  CELEBRATION
                </h2>

                <p className="mt-3 text-xl font-bold tracking-[0.35em] text-white">
                  GIFT BOX
                </p>

                <div className="mt-7 flex items-center justify-center gap-4 text-5xl">

                  <span className="mks-float">🎇</span>

                  <span
                    className="mks-float text-6xl"
                    style={{ animationDelay: ".5s" }}
                  >
                    🎆
                  </span>

                  <span
                    className="mks-float"
                    style={{ animationDelay: "1s" }}
                  >
                    🧨
                  </span>

                </div>

                <div className="mt-8 rounded-xl border border-yellow-200/20 bg-black/20 px-4 py-3">

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-yellow-200">
                    Make Every Moment Special
                  </p>

                </div>

              </div>

              {/* Decorative light */}

              <div className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 rounded-full bg-yellow-300/20 blur-2xl" />

              <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-orange-400/20 blur-2xl" />

            </div>

            {/* Bottom decorations */}

            <div
              className="mks-float mt-8 flex justify-center gap-7 text-4xl"
              style={{ animationDelay: ".8s" }}
            >
              <span>🧨</span>
              <span>🚀</span>
              <span>🎆</span>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom separator */}

      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

    </section>
  );
};

export default Hero;
