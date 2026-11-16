const Footer = () => {
  return (
    <footer className="bg-[#080a18] text-white">

      {/* Benefits */}
      <div className="border-b border-white/10">

        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-4">

          <div>
            <div className="text-2xl">🔒</div>
            <h3 className="mt-3 font-bold">Secure Payments</h3>
            <p className="mt-1 text-sm text-gray-400">
              100% Secure Transactions
            </p>
          </div>

          <div>
            <div className="text-2xl">↩️</div>
            <h3 className="mt-3 font-bold">Easy Returns</h3>
            <p className="mt-1 text-sm text-gray-400">
              7 Days Return Policy
            </p>
          </div>

          <div>
            <div className="text-2xl">🎧</div>
            <h3 className="mt-3 font-bold">Customer Support</h3>
            <p className="mt-1 text-sm text-gray-400">
              24/7 Support Available
            </p>
          </div>

          <div>
            <div className="text-2xl">🚚</div>
            <h3 className="mt-3 font-bold">Pan India Delivery</h3>
            <p className="mt-1 text-sm text-gray-400">
              Delivering Happiness
            </p>
          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-4">

          <div>
            <div className="text-3xl font-black text-red-500">
              MKS
            </div>

            <p className="mt-4 text-sm leading-6 text-gray-400">
              Premium quality crackers for every
              celebration. Safe products, great prices
              and reliable delivery.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>About Us</p>
              <p>Shop</p>
              <p>Categories</p>
              <p>Offers</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Customer Care</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>Contact Us</p>
              <p>Shipping Policy</p>
              <p>Return Policy</p>
              <p>Privacy Policy</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Contact</h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>📍 Tamil Nadu, India</p>
              <p>☎ +91 9789478940</p>
              <p>✉ support@mkscrackers.com</p>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © 2026 MKS Crackers. All Rights Reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;