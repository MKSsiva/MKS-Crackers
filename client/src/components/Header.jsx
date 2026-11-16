import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#080a18] px-4 py-2 text-xs text-white md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p>🔥 Free Delivery on orders above ₹999 | 100% Safe Packaging</p>

          <div className="hidden gap-6 md:flex">
            <span>📍 Track Order</span>
            <span>☎ +91 9789478940</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0d20]/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">

          {/* Logo */}
          <Link to="/" className="leading-none">
            <div className="text-3xl font-black tracking-tight text-red-600">
              MKS<span className="text-orange-500">🎉</span>
            </div>

            <div className="text-[10px] font-bold tracking-[0.25em] text-white">
              CRACKERS
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              to="/"
              className="border-b-2 border-red-500 pb-5 pt-5 font-semibold text-red-500"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="transition hover:text-red-400"
            >
              Shop
            </Link>

            <Link
              to="/categories"
              className="transition hover:text-red-400"
            >
              Categories⌄
            </Link>

            <Link
              to="/gift-boxes"
              className="transition hover:text-red-400"
            >
              Gift Boxes
            </Link>

            <Link
              to="/offers"
              className="transition hover:text-red-400"
            >
              Offers
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-red-400"
            >
              Contact
            </Link>
          </nav>

          {/* Search */}
          <div className="hidden w-64 items-center rounded-full bg-white/10 px-4 py-2 md:flex">
            <input
              type="text"
              placeholder="Search crackers..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-400"
            />

            <span>🔍</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 text-xl">
            <Link
              to={user ? "/profile" : "/login"}
              className="hidden transition hover:text-red-400 sm:block"
            >
              ♙
            </Link>

            <Link
              to="/wishlist"
              className="hidden transition hover:text-red-400 sm:block"
            >
              ♡
            </Link>

            <Link
              to="/cart"
              className="relative transition hover:text-red-400"
            >
              🛒
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold">
                3
              </span>
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="border-t border-white/10 bg-[#0b0d20] px-6 py-5 lg:hidden">
            <div className="flex flex-col gap-5">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>

              <Link to="/products" onClick={() => setMenuOpen(false)}>
                Shop
              </Link>

              <Link to="/categories" onClick={() => setMenuOpen(false)}>
                Categories
              </Link>

              <Link to="/gift-boxes" onClick={() => setMenuOpen(false)}>
                Gift Boxes
              </Link>

              <Link to="/offers" onClick={() => setMenuOpen(false)}>
                Offers
              </Link>

              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;