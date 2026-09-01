import { Link } from "react-router-dom";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden bg-gradient-to-r from-red-950 via-red-800 to-red-950 px-6 py-12 text-white">

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-300">
            Special Festival Offer
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-4xl">
            Make Your Celebrations
            <br />
            Extra Special
          </h2>

          <p className="mt-3 text-gray-200">
            Use Code: <strong>MKS10</strong> & Get 10% Extra Off
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-md bg-yellow-400 px-7 py-3 font-black text-red-900 transition hover:bg-yellow-300"
          >
            SHOP NOW
          </Link>
        </div>

        <div className="text-center">

          <p className="text-lg font-bold uppercase">
            Extra
          </p>

          <div className="text-7xl font-black text-yellow-300">
            10%
          </div>

          <p className="text-xl font-bold">
            OFF
          </p>

          <p className="mt-2 text-sm">
            ON PREPAID ORDERS
          </p>

        </div>

      </div>

    </section>
  );
};

export default PromoBanner;