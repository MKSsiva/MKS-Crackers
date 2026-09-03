import { useEffect, useState } from "react";

import {
  createHomepageFeature,
  deleteHomepageFeature,
  getAdminHomepageFeatures,
  updateHomepageFeature,
} from "../../services/api";

const HomepageFeatures = () => {
  const [features, setFeatures] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    icon: "",
    title: "",
    description: "",
    sort_order: 0,
    status: "active",
  });

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminHomepageFeatures();

      if (response.success) {
        setFeatures(response.features || []);
      } else {
        setError(
          response.message || "Failed to load homepage features."
        );
      }
    } catch (error) {
      console.error("Load homepage features error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load homepage features."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const resetForm = () => {
    setFormData({
      icon: "",
      title: "",
      description: "",
      sort_order: 0,
      status: "active",
    });

    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "sort_order"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.icon || !formData.title) {
      setError("Icon and title are required.");
      return;
    }

    try {
      setSaving(true);

      let response;

      if (editingId) {
        response = await updateHomepageFeature(
          editingId,
          formData
        );
      } else {
        response = await createHomepageFeature(formData);
      }

      if (response.success) {
        setSuccess(
          editingId
            ? "Homepage feature updated successfully."
            : "Homepage feature created successfully."
        );

        resetForm();

        await loadFeatures();
      } else {
        setError(
          response.message ||
            "Unable to save homepage feature."
        );
      }
    } catch (error) {
      console.error(
        "Save homepage feature error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to save homepage feature."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (feature) => {
    setEditingId(feature.id);

    setFormData({
      icon: feature.icon || "",
      title: feature.title || "",
      description: feature.description || "",
      sort_order: feature.sort_order || 0,
      status: feature.status || "active",
    });

    setSuccess("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this homepage feature?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await deleteHomepageFeature(id);

      if (response.success) {
        setSuccess(
          "Homepage feature deleted successfully."
        );

        await loadFeatures();

        if (editingId === id) {
          resetForm();
        }
      } else {
        setError(
          response.message ||
            "Unable to delete homepage feature."
        );
      }
    } catch (error) {
      console.error(
        "Delete homepage feature error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete homepage feature."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Homepage Features
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the feature cards displayed on your
          homepage.
        </p>
      </div>

      {/* Messages */}
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

      {/* Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            {editingId
              ? "Edit Homepage Feature"
              : "Add Homepage Feature"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            These values will control the feature section
            displayed on the customer homepage.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* Icon */}
          <div>
            <label
              htmlFor="icon"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Icon
            </label>

            <input
              id="icon"
              name="icon"
              type="text"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Example: 🚚"
              maxLength={50}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Fast Delivery"
              maxLength={100}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Example: Quick and reliable delivery"
              rows={3}
              maxLength={255}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            />
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
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Feature"
                : "Add Feature"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Feature List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            Existing Features
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {features.length} feature
            {features.length !== 1 ? "s" : ""} found.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-red-600"></div>

              <p className="text-sm text-gray-500">
                Loading homepage features...
              </p>
            </div>
          </div>
        ) : features.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mb-3 text-4xl">
              🏠
            </div>

            <p className="font-semibold text-gray-700">
              No homepage features found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add your first homepage feature above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
              >
                {/* Feature Info */}
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                    {feature.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {feature.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          feature.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {feature.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      {feature.description}
                    </p>

                    <p className="mt-2 text-xs text-gray-400">
                      Sort Order: {feature.sort_order}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(feature)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(feature.id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomepageFeatures;