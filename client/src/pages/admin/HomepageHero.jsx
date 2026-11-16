import { useEffect, useState } from "react";

import {
  getAdminHomepageHero,
  updateHomepageHero,
} from "../../services/api";

const HomepageHero = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    badge: "",
    title: "",
    subtitle: "",
    primary_button_text: "",
    primary_button_link: "",
    secondary_button_text: "",
    secondary_button_link: "",
    image: "",
    status: "active",
  });

  useEffect(() => {
    const loadHero = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminHomepageHero();

        if (response.success && response.hero) {
          setFormData({
            badge: response.hero.badge || "",
            title: response.hero.title || "",
            subtitle:
              response.hero.subtitle || "",
            primary_button_text:
              response.hero.primary_button_text || "",
            primary_button_link:
              response.hero.primary_button_link || "",
            secondary_button_text:
              response.hero.secondary_button_text || "",
            secondary_button_link:
              response.hero.secondary_button_link || "",
            image: response.hero.image || "",
            status:
              response.hero.status || "active",
          });
        }
      } catch (error) {
        console.error(
          "Load homepage hero error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load homepage hero."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title) {
      setError("Hero title is required.");
      return;
    }

    try {
      setSaving(true);

      const response =
        await updateHomepageHero(formData);

      if (response.success) {
        setSuccess(
          "Homepage hero updated successfully."
        );
      } else {
        setError(
          response.message ||
            "Failed to update homepage hero."
        );
      }
    } catch (error) {
      console.error(
        "Update homepage hero error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update homepage hero."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>

          <p className="text-sm text-gray-500">
            Loading homepage hero...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Homepage Hero
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the main hero section displayed on
          your customer homepage.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-600">
            {success}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="badge"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Badge
            </label>

            <input
              id="badge"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Example: MKS Crackers"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Hero Title
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter hero title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="subtitle"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Subtitle
            </label>

            <textarea
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              rows={3}
              placeholder="Enter hero subtitle"
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label
              htmlFor="primary_button_text"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Primary Button Text
            </label>

            <input
              id="primary_button_text"
              name="primary_button_text"
              value={formData.primary_button_text}
              onChange={handleChange}
              placeholder="Shop Now"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label
              htmlFor="primary_button_link"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Primary Button Link
            </label>

            <input
              id="primary_button_link"
              name="primary_button_link"
              value={formData.primary_button_link}
              onChange={handleChange}
              placeholder="/products"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label
              htmlFor="secondary_button_text"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Secondary Button Text
            </label>

            <input
              id="secondary_button_text"
              name="secondary_button_text"
              value={formData.secondary_button_text}
              onChange={handleChange}
              placeholder="Explore Categories"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label
              htmlFor="secondary_button_link"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Secondary Button Link
            </label>

            <input
              id="secondary_button_link"
              name="secondary_button_link"
              value={formData.secondary_button_link}
              onChange={handleChange}
              placeholder="/categories"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Hero Image URL
            </label>

            <input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Cloudinary image URL"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Hero"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomepageHero;