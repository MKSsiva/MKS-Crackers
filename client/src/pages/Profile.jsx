import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getMobileNumber = (value) =>
    String(value || "")
      .replace(/^\+91/, "")
      .replace(/\D/g, "")
      .slice(-10);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/me");
      const result = response?.data ?? response;

      const user =
        result?.user ??
        result?.data?.user ??
        result?.profile ??
        result?.data ??
        null;

      if (!result?.success || !user) {
        throw new Error(result?.message || "Unable to load profile.");
      }

      setProfile(user);

      setForm({
        name: user.name || user.full_name || "",
        phone: getMobileNumber(user.phone || user.mobile || ""),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while loading your profile."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setForm({
      name: profile?.name || profile?.full_name || "",
      phone: getMobileNumber(profile?.phone || profile?.mobile || ""),
    });

    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({
      name: profile?.name || profile?.full_name || "",
      phone: getMobileNumber(profile?.phone || profile?.mobile || ""),
    });

    setEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (name.length < 2 || name.length > 100) {
      setError("Name must contain between 2 and 100 characters.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/users/me", {
        name,
        phone,
      });

      const result = response?.data ?? response;
      const updatedUser = result?.user;

      if (!result?.success || !updatedUser) {
        throw new Error(result?.message || "Profile update failed.");
      }

      setProfile(updatedUser);

      setForm({
        name: updatedUser.name || "",
        phone: getMobileNumber(updatedUser.phone || ""),
      });

      setEditing(false);
      setSuccess(result.message || "Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Customer logout: always return to the customer login page.
  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout from MKS Crackers?"
    );

    if (!confirmed) return;

    logout();
    navigate("/login", { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const buttonBase =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-bold transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-600 shadow-lg" />
          <p className="mt-5 animate-pulse font-semibold text-gray-700">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4">
        <div className="mk-3d-card w-full max-w-md rounded-3xl border border-orange-100 bg-white p-8 text-center shadow-xl">
          <div className="mb-5 text-5xl">⚠️</div>

          <h2 className="text-2xl font-bold text-gray-900">
            Unable to Load Profile
          </h2>

          <p className="mt-3 text-gray-500">{error}</p>

          <button
            type="button"
            onClick={loadProfile}
            className={`${buttonBase} mk-3d-button mt-6 text-white`}
          >
            Try Again
          </button>

          <div className="mt-5">
            <Link
              to="/"
              className="font-semibold text-orange-600 hover:text-orange-800 hover:underline"
            >
              ← Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = profile?.name || profile?.full_name || "Customer";
  const email = profile?.email || "Not available";
  const storedPhone = profile?.phone || profile?.mobile || "";

  const phone = storedPhone
    ? `+91 ${getMobileNumber(storedPhone)}`
    : "Not available";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Top Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">

            <Link
              to="/"
              className={`${buttonBase} border border-orange-200 bg-white text-orange-700 shadow-lg shadow-orange-200/50 hover:border-orange-500 hover:bg-orange-600 hover:text-white`}
            >
              <span className="text-xl">←</span>
              Back to Shopping
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className={`${buttonBase} border border-red-500 bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/30 hover:from-red-700 hover:to-rose-600`}
            >
              <span className="text-lg">↪</span>
              Logout
            </button>

          </div>

          <div className="mt-7">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your personal information and account details.
            </p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="mk-3d-card overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">

          {/* Orange Gradient Profile Banner */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 text-white shadow-inner sm:h-44">

            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/20 bg-white/10" />
            <div className="absolute -right-5 top-12 h-36 w-36 rounded-full border border-white/20 bg-white/10" />
            <div className="absolute right-32 -bottom-24 h-48 w-48 rounded-full bg-white/10" />

            <div className="absolute bottom-5 left-6 z-10 sm:left-8">
              <p className="text-sm font-bold tracking-[0.25em] text-orange-100">
                MKS CRACKERS
              </p>

              <p className="mt-1 text-xl font-extrabold drop-shadow-lg sm:text-2xl">
                Customer Account
              </p>

              <p className="mt-1 text-xs font-medium text-white/90">
                Your account, your celebrations.
              </p>
            </div>
          </div>

          <div className="px-5 pb-8 sm:px-8">

            {/* Avatar and Customer Details */}
            <div className="relative -mt-12 flex flex-col gap-4 sm:flex-row sm:items-end">

              <div className="h-24 w-24 rounded-2xl bg-white p-1.5 shadow-xl">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-amber-200 text-3xl font-extrabold text-orange-700">
                  {getInitials(name)}
                </div>
              </div>

              <div className="pb-1">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  {name}
                </h2>

                <p className="break-all text-gray-500">{email}</p>

                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  Active Account
                </span>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-green-700">
                <span className="font-bold">✓ </span>
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700">
                <span className="font-bold">⚠ </span>
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="mt-10">

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Your registered account details.
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className={`${buttonBase} bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 hover:from-orange-700 hover:via-orange-600 hover:to-amber-500`}
                  >
                    <span>✎</span>
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Edit Form */}
              {editing ? (
                <form onSubmit={handleSave} className="space-y-5">

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      maxLength={100}
                      minLength={2}
                      required
                      placeholder="Enter your full name"
                      className="mk-3d-input w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-gray-700">
                      Mobile Number *
                    </label>

                    <div className="flex w-full overflow-hidden rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-orange-500">
                      <span className="flex items-center border-r border-gray-300 bg-gray-100 px-4 font-bold text-gray-700">
                        +91
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((previous) => ({
                            ...previous,
                            phone: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10),
                          }))
                        }
                        maxLength={10}
                        minLength={10}
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        required
                        placeholder="10 Digit Mobile Number"
                        className="w-full px-4 py-3 outline-none"
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Enter your 10-digit Indian mobile number.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-3">

                    <button
                      type="submit"
                      disabled={saving}
                      className={`${buttonBase} bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/20 hover:from-green-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {saving ? "Saving..." : "✓ Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className={`${buttonBase} border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50`}
                    >
                      Cancel
                    </button>

                  </div>
                </form>
              ) : (

                /* Profile Details */
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div className="mk-3d-info-card">
                    <p className="mb-2 text-sm text-gray-500">Full Name</p>
                    <p className="break-words font-bold text-gray-900">
                      {name}
                    </p>
                  </div>

                  <div className="mk-3d-info-card">
                    <p className="mb-2 text-sm text-gray-500">Email Address</p>
                    <p className="break-all font-bold text-gray-900">
                      {email}
                    </p>
                  </div>

                  <div className="mk-3d-info-card">
                    <p className="mb-2 text-sm text-gray-500">Phone Number</p>
                    <p className="font-bold text-gray-900">{phone}</p>
                  </div>

                  <div className="mk-3d-info-card">
                    <p className="mb-2 text-sm text-gray-500">Account Type</p>
                    <p className="font-bold capitalize text-gray-900">
                      {profile?.role || "Customer"}
                    </p>
                  </div>

                  <div className="mk-3d-info-card md:col-span-2">
                    <p className="mb-2 text-sm text-gray-500">Member Since</p>
                    <p className="font-bold text-gray-900">
                      {formatDate(profile?.created_at || profile?.createdAt)}
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* Account Shortcuts */}
            <div className="mt-12">

              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-gray-900">
                  Account Shortcuts
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Quickly access your orders and delivery addresses.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <Link
                  to="/my-orders"
                  className="mk-3d-link-card flex items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 to-amber-400 text-2xl text-white shadow-lg">
                      📦
                    </div>

                    <div>
                      <p className="font-extrabold text-gray-900">My Orders</p>
                      <p className="mt-1 text-sm text-gray-500">
                        View and track your orders
                      </p>
                    </div>
                  </div>

                  <span className="text-2xl font-bold text-orange-600">→</span>
                </Link>

                <Link
                  to="/addresses"
                  className="mk-3d-link-card flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl text-white shadow-lg">
                      📍
                    </div>

                    <div>
                      <p className="font-extrabold text-gray-900">My Addresses</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage your delivery addresses
                      </p>
                    </div>
                  </div>

                  <span className="text-2xl font-bold text-orange-600">→</span>
                </Link>

              </div>
            </div>

            {/* Bottom Shopping Link */}
            <div className="mt-10 border-t border-gray-100 pt-7 text-center">
              <p className="mb-4 text-sm text-gray-500">
                Ready for your next celebration?
              </p>

              <Link
                to="/products"
                className={`${buttonBase} bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30 hover:from-orange-700 hover:via-orange-600 hover:to-amber-500`}
              >
                🛍️ Explore Crackers
              </Link>
            </div>

          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} MKS Crackers. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Profile;
