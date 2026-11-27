import { Link } from "react-router-dom";

const PromoBanner = ({
  promo = null,
  loading = false,
  error = false,
}) => {
  if (loading) {
    return (
      <section className="bg-[#11172b] px-6 py-16">
        <div className="mks-shimmer mx-auto h-56 max-w-7xl rounded-3xl" />
      </section>
    );
  }

  if (error || !promo) return null;

  const title =
    promo.title || "Make Your Celebrations Extra Special";

  const subtitle =
    promo.subtitle || "Special Festival Offer";

  const offerText =
    promo.offer_text || "ON PREPAID ORDERS";

  const couponCode = promo.coupon_code || "";
  const discount = Number(promo.discount) || 0;

  const buttonText = promo.button_text || "SHOP NOW";
  const buttonLink = promo.button_link || "/products";

  // Supports common promo image field names.
  const rawBannerImage =
    promo.banner_image_url ||
    promo.banner_image ||
    promo.image_url ||
    promo.image ||
    "";

  const bannerImage =
    typeof rawBannerImage === "string"
      ? rawBannerImage
      : rawBannerImage?.secure_url ||
        rawBannerImage?.url ||
        "";

  return (
    <section className="relative isolate overflow-hidden bg-[#100d20] px-6 py-16 text-white md:py-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-950 via-orange-950/70 to-[#11152a]" />

      <div className="absolute -right-20 top-0 -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-[100px]" />

      <div className="absolute -left-20 bottom-0 -z-10 h-64 w-64 rounded-full bg-red-500/20 blur-[100px]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">

        {/* LEFT: PROMO CONTENT */}
        <div className="relative z-10">
          <p className="inline-flex rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-yellow-200">
            ✨ {subtitle}
          </p>

          <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight md:text-5xl">
            {title}
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-300 md:text-base">
            {couponCode ? (
              <>
                Use Code:{" "}
                <strong className="rounded-lg border border-dashed border-yellow-300/60 bg-yellow-300/10 px-3 py-1 text-yellow-200">
                  {couponCode}
                </strong>

                {discount > 0
                  ? ` and get ${discount}% extra off`
                  : ""}
              </>
            ) : discount > 0 ? (
              `Get ${discount}% extra off`
            ) : (
              offerText
            )}
          </p>

          <Link
            to={buttonLink}
            className="mks-glow-button mt-8"
          >
            {buttonText}
            <span>→</span>
          </Link>
        </div>

        {/* RIGHT: ADMIN UPLOADED IMAGE OR OFFER CARD */}
        <div className="relative mx-auto w-full max-w-lg">

          {bannerImage ? (
            <div className="mks-glass mks-3d-card relative overflow-hidden rounded-[30px] p-3">

              <img
                src={bannerImage}
                alt={title}
                loading="lazy"
                className="h-64 w-full rounded-2xl object-cover md:h-80"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  const fallback =
                    event.currentTarget.nextElementSibling;

                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />

              {/* Fallback if uploaded image cannot load */}
              <div
                className="hidden min-h-64 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-red-950 via-orange-950 to-slate-950 text-center md:min-h-80"
              >
                <span className="text-7xl">🎇</span>
                <p className="mt-4 text-xl font-black text-yellow-200">
                  {discount}% OFF
                </p>
                <p className="mt-2 text-sm text-white">
                  {offerText}
                </p>
              </div>

              {discount > 0 && (
                <div className="absolute bottom-7 right-7 rounded-2xl border border-yellow-300/40 bg-black/75 px-5 py-3 text-center shadow-2xl backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow-200">
                    Extra
                  </p>
                  <p className="text-3xl font-black text-yellow-300">
                    {discount}%
                  </p>
                  <p className="text-xs font-bold text-white">
                    OFF
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mks-float-delay mx-auto w-full max-w-sm">
              <div className="mks-glass mks-pulse-glow relative rounded-[32px] p-8 text-center">
                <div className="text-5xl">🎇</div>

                <p className="mt-4 text-sm font-bold uppercase tracking-[.3em] text-yellow-200">
                  Extra Savings
                </p>

                <div className="mks-gradient-text my-2 text-7xl font-black md:text-8xl">
                  {discount}%
                </div>

                <p className="text-2xl font-black">OFF</p>

                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-300">
                  {offerText}
                </p>

                {couponCode && (
                  <p className="mt-5 rounded-xl border border-dashed border-yellow-300/40 bg-yellow-300/10 px-4 py-3 font-black tracking-[.2em] text-yellow-200">
                    {couponCode}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
