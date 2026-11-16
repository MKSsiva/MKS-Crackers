import { useEffect, useState } from "react";

import {
  getAdminHomepagePromo,
  updateHomepagePromo,
} from "../../services/api";

const HomepagePromo = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    offer_text: "",
    coupon_code: "",
    discount: "",
    button_text: "",
    button_link: "",
    image: "",
    status: "active",
    sort_order: 0,
  });

  useEffect(() => {
    const loadPromo = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminHomepagePromo();

        if (response.success && response.promo) {
          setFormData({
            title:
              response.promo.title || "",

            subtitle:
              response.promo.subtitle || "",

            offer_text:
              response.promo.offer_text || "",

            coupon_code:
              response.promo.coupon_code || "",

            discount:
              response.promo.discount || "",

            button_text:
              response.promo.button_text || "",

            button_link:
              response.promo.button_link || "",

            image:
              response.promo.image || "",

            status:
              response.promo.status || "active",

            sort_order:
              response.promo.sort_order || 0,
          });
        }
      } catch (error) {
        console.error(
          "Load homepage promo error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load homepage promo banner."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPromo();
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

    if (!formData.title.trim()) {
      setError(
        "Promo banner title is required."
      );

      return;
    }

    try {
      setSaving(true);

      const response =
        await updateHomepagePromo(formData);

      if (response.success) {
        setSuccess(
          "Homepage promo banner updated successfully."
        );
      } else {
        setError(
          response.message ||
            "Failed to update homepage promo banner."
        );
      }
    } catch (error) {
      console.error(
        "Update homepage promo error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update homepage promo banner."
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
            Loading promo banner...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Promo Banner
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the promotional banner displayed
          on your customer homepage.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm font-medium text-green-600">
            {success}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* Subtitle / Badge */}
          <div className="md:col-span-2">
            <label
              htmlFor="subtitle"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Offer Label
            </label>

            <input
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Example: Special Festival Offer"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Banner Title
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Make Your Celebrations Extra Special"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Coupon */}
          <div>
            <label
              htmlFor="coupon_code"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Coupon Code
            </label>

            <input
              id="coupon_code"
              name="coupon_code"
              value={formData.coupon_code}
              onChange={handleChange}
              placeholder="Example: MKS10"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Discount */}
          <div>
            <label
              htmlFor="discount"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Discount (%)
            </label>

            <input
              id="discount"
              name="discount"
              type="number"
              min="0"
              step="0.01"
              value={formData.discount}
              onChange={handleChange}
              placeholder="10"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Offer Text */}
          <div className="md:col-span-2">
            <label
              htmlFor="offer_text"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Offer Text
            </label>

            <input
              id="offer_text"
              name="offer_text"
              value={formData.offer_text}
              onChange={handleChange}
              placeholder="Example: ON PREPAID ORDERS"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm uppercase outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Button Text */}
          <div>
            <label
              htmlFor="button_text"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Button Text
            </label>

            <input
              id="button_text"
              name="button_text"
              value={formData.button_text}
              onChange={handleChange}
              placeholder="Example: SHOP NOW"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Button Link */}
          <div>
            <label
              htmlFor="button_link"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Button Link
            </label>

            <input
              id="button_link"
              name="button_link"
              value={formData.button_link}
              onChange={handleChange}
              placeholder="/products"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Image */}
          <div className="md:col-span-2">
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Banner Image URL
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

          {/* Status */}
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

          {/* Sort Order */}
          <div>
            <label
              htmlFor="sort_order"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Sort Order
            </label>

            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

        </div>

        {/* Save */}
        <div className="border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Promo Banner"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default HomepagePromo;