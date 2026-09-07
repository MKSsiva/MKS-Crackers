import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "active",
  sort_order: 0,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories();

      if (
        response.success &&
        Array.isArray(response.categories)
      ) {
        setCategories(response.categories);
      } else {
        setCategories([]);
        setError("Failed to load categories.");
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
      setError(
        error.response?.data?.message ||
          "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (event) => {
    const value = event.target.value;

    setForm((previous) => ({
      ...previous,
      name: value,
      slug:
        editingId !== null
          ? previous.slug
          : generateSlug(value),
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      status: category.status || "active",
      sort_order: category.sort_order ?? 0,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!form.name.trim()) {
        setError("Category name is required.");
        return;
      }

      if (!form.slug.trim()) {
        setError("Category slug is required.");
        return;
      }

      const data = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        status: form.status,
        sort_order: Number(form.sort_order) || 0,
      };

      let response;

      if (editingId !== null) {
        response = await updateCategory(
          editingId,
          data
        );
      } else {
        response = await createCategory(data);
      }

      if (!response.success) {
        setError(
          response.message ||
            "Failed to save category."
        );
        return;
      }

      setSuccess(
        editingId !== null
          ? "Category updated successfully."
          : "Category created successfully."
      );

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadCategories();
    } catch (error) {
      console.error("Save category error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await deleteCategory(id);

      if (!response.success) {
        setError(
          response.message ||
            "Failed to delete category."
        );
        return;
      }

      setSuccess(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black text-[#10142d]">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage product categories displayed on
            your MKS Crackers website.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          + Add Category
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#10142d]">
                {editingId !== null
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editingId !== null
                  ? "Update category information."
                  : "Create a new product category."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-2"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Category Name *
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Example: Sparklers"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Slug *
              </label>

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="example: sparklers"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe this category..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Sort Order
              </label>

              <input
                type="number"
                name="sort_order"
                value={form.sort_order}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-black text-[#10142d]">
            All Categories
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {categories.length} categor
            {categories.length === 1
              ? "y"
              : "ies"}{" "}
            found
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-5xl">📂</div>

            <h3 className="mt-4 text-lg font-bold text-gray-700">
              No categories found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Create your first category.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-6 py-4">
                    ID
                  </th>

                  <th className="px-6 py-4">
                    Category
                  </th>

                  <th className="px-6 py-4">
                    Slug
                  </th>

                  <th className="px-6 py-4">
                    Sort
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-500">
                      #{index + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-50 to-orange-50 text-2xl">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            "📂"
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-gray-800">
                            {category.name}
                          </p>

                          {category.description && (
                            <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.slug}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                      {category.sort_order ?? 0}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          category.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(category)
                          }
                          className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          disabled={
                            deletingId ===
                            category.id
                          }
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId ===
                          category.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;