const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-700 to-orange-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">

          <h1 className="text-5xl font-bold md:text-6xl">
            MKS Crackers
          </h1>

          <p className="mt-6 text-xl">
            Celebrate Every Moment With Joy
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-red-100">
            Discover premium quality crackers for
            festivals, celebrations and special occasions.
          </p>

          <button className="mt-8 rounded-lg bg-white px-8 py-3 font-semibold text-red-700 shadow-lg transition hover:bg-gray-100">
            Shop Now
          </button>

        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <h2 className="text-center text-3xl font-bold text-gray-800">
          Shop By Category
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {[
            "Sparklers",
            "Flower Pots",
            "Rockets",
            "Gift Boxes",
          ].map((category) => (
            <div
              key={category}
              className="rounded-xl bg-white p-8 text-center shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">🎆</div>

              <h3 className="mt-4 text-xl font-semibold">
                {category}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Explore our collection
              </p>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
};

export default Home;