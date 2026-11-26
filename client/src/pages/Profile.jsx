import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
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
        phone: user.phone || user.mobile || "",
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
  };

  useEffect(() => {
    loadProfile();
  }, []);

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
      phone: profile?.phone || profile?.mobile || "",
    });

    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({
      name: profile?.name || profile?.full_name || "",
      phone: profile?.phone || profile?.mobile || "",
    });

    setEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    const phoneDigits = phone.replace(/\D/g, "");

    if (name.length < 2 || name.length > 100) {
      setError("Name must contain between 2 and 100 characters.");
      return;
    }

    if (!/^\+91[6-9]\d{9}$/.test(phone)) {
  setError(
    "Enter a valid Indian mobile number. Example: +919500969648"
  );
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
        phone: updatedUser.phone || "",
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

  const handleLogout = () => {
  const confirmed = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmed) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.replace("/login");
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

    if (Number.isNaN(parsedDate.getTime())) return "Not available";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800">
            Unable to load profile
          </h2>
          <p className="text-gray-500 mt-2">{error}</p>

          <button
            onClick={loadProfile}
            className="mt-6 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </button>

          <div className="mt-4">
            <Link to="/" className="text-orange-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = profile?.name || profile?.full_name || "Customer";
  const email = profile?.email || "Not available";
  const phone = profile?.phone || profile?.mobile || "Not available";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Shopping
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-orange-500 to-amber-400" />

          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-3xl font-bold">
                  {getInitials(name)}
                </div>
              </div>

              <div className="pb-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {name}
                </h2>
                <p className="text-gray-500">{email}</p>
              </div>

              <div className="sm:ml-auto flex flex-wrap items-center gap-3 sm:pb-2">
  <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-4 py-2 text-sm font-semibold">
    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
    Active Account
  </span>

  <button
    type="button"
    onClick={handleLogout}
    className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-5 py-2.5 rounded-lg font-semibold transition"
  >
    <span>↪</span>
    Logout
  </button>
</div>
            </div>

            {success && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                <span className="font-semibold">✓ </span>
                {success}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            )}

            <div className="mt-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>

                {!editing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
                  >
                    ✎ Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      maxLength={100}
                      required
                      minLength={2}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
  type="tel"
  name="phone"
  value={form.phone}
  onChange={handleChange}
  maxLength={13}
  inputMode="tel"
  pattern="\+91[6-9][0-9]{9}"
  required
  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
  placeholder="+919500969648"
/>

<p className="text-xs text-gray-500 mt-2">
  Enter your 10-digit Indian mobile number with +91 country code.
  Example: +919500969648
</p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white px-7 py-3 rounded-lg font-semibold transition"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-7 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-2">Full Name</p>
                    <p className="font-semibold text-gray-900 break-words">
                      {name}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-2">Email Address</p>
                    <p className="font-semibold text-gray-900 break-words">
                      {email}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                    <p className="font-semibold text-gray-900">
                      {phone}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-sm text-gray-500 mb-2">Account Type</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {profile?.role || "Customer"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(profile?.created_at)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-5">
                Account Shortcuts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/my-orders"
                  className="flex items-center justify-between border border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:bg-orange-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">My Orders</p>
                    <p className="text-sm text-gray-500 mt-1">
                      View and track your orders
                    </p>
                  </div>
                  <span className="text-orange-600 text-xl">→</span>
                </Link>

                <Link
                  to="/addresses"
                  className="flex items-center justify-between border border-gray-200 rounded-xl p-5 hover:border-orange-400 hover:bg-orange-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">My Addresses</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your delivery addresses
                    </p>
                  </div>
                  <span className="text-orange-600 text-xl">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
