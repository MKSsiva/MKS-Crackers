
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        formData.email.trim(),
        formData.password
      );

      if (!result?.success) {
        setError(result?.message || "Login failed. Please try again.");
        return;
      }

      // Confirm the backend returned a usable JWT.
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") {
        setError("Login succeeded, but the server did not provide an authentication token.");
        return;
      }

      const destination =
        location.state?.from?.pathname || "/products";

      navigate(destination, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, go to the products page.
 useEffect(() => {
  if (user) {
    navigate("/products", { replace: true });
  }
}, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-orange-50 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">

        {/* Left panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-10 text-white md:flex">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="text-3xl font-extrabold tracking-wide">
              MKS <span className="text-orange-400">Crackers</span>
            </Link>
            <p className="mt-3 text-sm text-slate-300">
              Celebrate every moment with joy.
            </p>
          </div>

          <div className="relative z-10">
            <div className="mb-6 text-6xl">🎉</div>
            <h2 className="text-4xl font-bold leading-tight">
              Welcome back!
            </h2>
            <p className="mt-4 max-w-sm leading-7 text-slate-300">
              Login to explore our products, manage your cart and track your
              MKS Crackers orders.
            </p>
          </div>

          <p className="relative z-10 text-xs text-slate-400">
            © {new Date().getFullYear()} MKS Crackers. All rights reserved.
          </p>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-md">

            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-orange-600"
            >
              ← Back to Home
            </Link>

            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-600">
                Customer Account
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                Sign in
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your account details to continue shopping.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
{location.state?.successMessage && (
  <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
    {location.state.successMessage}
  </div>
)}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-16 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-orange-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login to Your Account"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
  Don't have an account?{" "}
  <Link
    to="/register"
    className="font-semibold text-orange-600 hover:text-orange-700"
  >
    Create Account
  </Link>
</div>

            <div className="mt-8 border-t border-slate-100 pt-5 text-center">
              <Link
                to="/admin/login"
                className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
