import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-[#060a17] text-white">
      <div className="h-1 bg-gradient-to-r from-orange-600 via-yellow-300 to-red-600" />

      {/* Service benefits */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🔒", "Secure Payments", "100% Secure Transactions"],
            ["↩️", "Easy Returns", "7 Days Return Policy"],
            ["🎧", "Customer Support", "We're Here to Help"],
            ["🚚", "Pan India Delivery", "Delivering Happiness"],
          ].map(([icon, title, description]) => (
            <div key={title} className="group flex items-center gap-4">
              <div className="mks-glass flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl transition duration-300 group-hover:-translate-y-1 group-hover:border-orange-300/40">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-1 text-xs text-slate-400">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-block">
              <span className="mks-gradient-text text-4xl font-black">
                MKS
              </span>
              <span className="block text-xs font-bold tracking-[.35em] text-orange-200">
                CRACKERS
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              Premium quality crackers for every celebration.
              Explore our collection and make every special
              moment brighter with MKS Crackers.
            </p>

            <div className="mt-6 flex gap-3">
              {["f", "◎", "▶"].map((item) => (
                <span
                  key={item}
                  className="mks-glass flex h-10 w-10 items-center justify-center rounded-xl font-bold text-orange-200 transition hover:-translate-y-1 hover:border-orange-300/50"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-black text-white">Quick Links</h3>
            <div className="mt-5 space-y-4 text-sm">
              <Link to="/" className="mks-footer-link block">Home</Link>
              <Link to="/products" className="mks-footer-link block">Shop Products</Link>
              <Link to="/products" className="mks-footer-link block">Categories</Link>
              <Link to="/cart" className="mks-footer-link block">Shopping Cart</Link>
            </div>
          </div>

          <div>
            <h3 className="font-black text-white">Customer Care</h3>
            <div className="mt-5 space-y-4 text-sm">
              <Link to="/profile" className="mks-footer-link block">My Account</Link>
              <Link to="/my-orders" className="mks-footer-link block">My Orders</Link>
              <Link to="/addresses" className="mks-footer-link block">My Addresses</Link>
              <Link to="/login" className="mks-footer-link block">Sign In</Link>
            </div>
          </div>

          <div>
            <h3 className="font-black text-white">Contact Us</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-400">
              <p>📍 Tamil Nadu, India</p>
              <p>
                ☎{" "}
                <a className="mks-footer-link" href="tel:+919789478940">
                  +91 9789478940
                </a>
              </p>
              <p>
                ✉{" "}
                <a
                  className="mks-footer-link"
                  href="mailto:support@mkscrackers.com"
                >
                  support@mkscrackers.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-7 text-center text-xs text-slate-500 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} MKS Crackers. All Rights Reserved.</p>
          <p className="text-slate-400">
            Made with ❤️ for every celebration
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
