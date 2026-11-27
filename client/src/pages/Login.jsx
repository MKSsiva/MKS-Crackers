import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mk-login-page">
      <div className="mk-login-background">
        <div className="mk-glow mk-glow-one" />
        <div className="mk-glow mk-glow-two" />
        <div className="mk-grid-overlay" />

        <div className="mk-orbit mk-orbit-one">
          <span />
        </div>
        <div className="mk-orbit mk-orbit-two">
          <span />
        </div>

        <div className="mk-floating-shape mk-shape-one">✦</div>
        <div className="mk-floating-shape mk-shape-two">◇</div>
        <div className="mk-floating-shape mk-shape-three">✧</div>
        <div className="mk-floating-shape mk-shape-four">+</div>
        <div className="mk-floating-shape mk-shape-five">✦</div>
      </div>

      <div className="mk-login-content">
        <section className="mk-login-card">
          <div className="mk-card-top-line" />

          <div className="mk-login-brand">
            <div className="mk-brand-icon">
              <span>✦</span>
            </div>
            <div>
              <h1>MKS CRACKERS</h1>
              <p>LIGHT UP YOUR CELEBRATIONS</p>
            </div>
          </div>

          <div className="mk-login-heading">
            <span className="mk-welcome-label">
              <span className="mk-live-dot" />
              YOUR CELEBRATION STARTS HERE
            </span>

            <h2>
              Welcome
              <br />
              <span>Back.</span>
            </h2>

            <p>Sign in to discover something spectacular.</p>
          </div>

          {error && (
            <div className="mk-login-error" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mk-login-form">
            <div className="mk-input-group">
              <label htmlFor="login-email">EMAIL ADDRESS</label>

              <div className="mk-input-shell">
                <span className="mk-input-icon">✉</span>
                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="mk-input-group">
              <label htmlFor="login-password">PASSWORD</label>

              <div className="mk-input-shell">
                <span className="mk-input-icon">◈</span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="mk-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mk-login-button"
              disabled={loading}
            >
              <span>{loading ? "SIGNING IN..." : "SIGN IN"}</span>
              <span className="mk-button-arrow">
                {loading ? "◌" : "→"}
              </span>
            </button>
          </form>

          <div className="mk-login-divider">
            <span />
            <p>NEW TO MKS CRACKERS?</p>
            <span />
          </div>

          <Link to="/register" className="mk-register-link">
            CREATE YOUR ACCOUNT <span>↗</span>
          </Link>

          <div className="mk-login-footer">
            <span>SECURE ACCESS</span>
            <span className="mk-footer-dot">•</span>
            <span>MADE FOR CELEBRATIONS</span>
          </div>
        </section>

        <p className="mk-outside-caption">
          <span>✦</span> Every celebration deserves a little sparkle.
        </p>
      </div>
    </main>
  );
};

export default Login;
