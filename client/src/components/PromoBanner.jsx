import { Link } from "react-router-dom";

const PromoBanner = ({
  promo = null,
  loading = false,
  error = false,
}) => {
  // =============================================
  // LOADING STATE
  // =============================================

  if (loading) {
    return (
      <section className="overflow-hidden bg-gradient-to-r from-red-950 via-red-800 to-red-950 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
          <div className="w-full animate-pulse space-y-4">
            <div className="h-4 w-48 rounded bg-white/20" />

            <div className="h-10 w-96 max-w-full rounded bg-white/20" />

            <div className="h-5 w-72 max-w-full rounded bg-white/20" />

            <div className="h-12 w-32 rounded bg-white/20" />
          </div>

          <div className="hidden w-48 animate-pulse text-center md:block">
            <div className="mx-auto h-5 w-20 rounded bg-white/20" />

            <div className="mx-auto mt-2 h-20 w-32 rounded bg-white/20" />

            <div className="mx-auto mt-2 h-5 w-16 rounded bg-white/20" />
          </div>
        </div>
      </section>
    );
  }

  // =============================================
  // ERROR STATE
  // =============================================

  if (error || !promo) {
    return null;
  }

  // =============================================
  // DYNAMIC VALUES
  // =============================================

  const title = promo.title || "Make Your Celebrations Extra Special";

  const subtitle =
    promo.subtitle || "Special Festival Offer";

  const offerText =
    promo.offer_text || "ON PREPAID ORDERS";

  const couponCode =
    promo.coupon_code || "";

  const discount =
    Number(promo.discount) || 0;

  const buttonText =
    promo.button_text || "SHOP NOW";

  const buttonLink =
    promo.button_link || "/products";

  return (
    <section className="overflow-hidden bg-gradient-to-r from-red-950 via-red-800 to-red-950 px-6 py-12 text-white">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">

        {/* =========================================
            LEFT CONTENT
        ========================================= */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
            {subtitle}
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            {title}
          </h2>

          <p className="mt-3 text-gray-200">
            {couponCode ? (
              <>
                Use Code:{" "}
                <strong>{couponCode}</strong>
                {discount > 0
                  ? ` & Get ${discount}% Extra Off`
                  : ""}
              </>
            ) : (
              <>
                {discount > 0
                  ? `Get ${discount}% Extra Off`
                  : ""}
              </>
            )}
          </p>

          <Link
            to={buttonLink}
            className="mt-6 inline-block rounded-md bg-yellow-400 px-7 py-3 font-black text-red-900 transition hover:bg-yellow-300"
          >
            {buttonText}
          </Link>

        </div>

        {/* =========================================
            RIGHT DISCOUNT
        ========================================= */}

        <div className="text-center">

          <p className="text-lg font-bold uppercase">
            Extra
          </p>

          <div className="text-7xl font-black text-yellow-300">
            {discount}%
          </div>

          <p className="text-xl font-bold">
            OFF
          </p>

          <p className="mt-2 text-sm">
            {offerText}
          </p>

        </div>

      </div>

    </section>
  );
};

export default PromoBanner;

