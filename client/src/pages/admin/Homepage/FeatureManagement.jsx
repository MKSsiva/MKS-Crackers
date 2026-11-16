import { useEffect, useState } from "react";

import {
  getAdminHomepageFeatures,
  createHomepageFeature,
  updateHomepageFeature,
  deleteHomepageFeature,
} from "../../../services/api";


const emptyForm = {
  icon: "",
  title: "",
  description: "",
  sort_order: 0,
  status: "active",
};


export default function FeatureManagement() {
  const [features, setFeatures] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const loadFeatures = async () => {
    try {
      setLoading(true);

      const data =
        await getAdminHomepageFeatures();

      if (data.success) {
        setFeatures(data.features);
      }
    } catch (error) {
      console.error(
        "Failed to load features:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadFeatures();
  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.icon.trim() || !form.title.trim()) {
      alert("Icon and title are required.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateHomepageFeature(
          editingId,
          {
            ...form,
            sort_order: Number(form.sort_order),
          }
        );
      } else {
        await createHomepageFeature({
          ...form,
          sort_order: Number(form.sort_order),
        });
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadFeatures();
    } catch (error) {
      console.error(
        "Failed to save feature:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to save feature"
      );
    } finally {
      setSaving(false);
    }
  };


  const handleEdit = (feature) => {
    setEditingId(feature.id);

    setForm({
      icon: feature.icon || "",
      title: feature.title || "",
      description:
        feature.description || "",
      sort_order:
        feature.sort_order ?? 0,
      status:
        feature.status || "active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feature?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteHomepageFeature(id);

      await loadFeatures();
    } catch (error) {
      console.error(
        "Failed to delete feature:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to delete feature"
      );
    }
  };


  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };


  return (
    <div className="p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Homepage Features
        </h1>

        <p className="mt-2 text-gray-500">
          Manage the feature cards displayed on the
          customer homepage.
        </p>
      </div>


      {/* FORM */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">

        <h2 className="text-xl font-semibold mb-6">
          {editingId
            ? "Edit Feature"
            : "Add Feature"}
        </h2>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          <div>
            <label className="block text-sm font-medium mb-2">
              Icon
            </label>

            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="🛡️"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Secure Payment"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Safe and secure UPI payment"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-2">
              Sort Order
            </label>

            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>
          </div>


          <div className="md:col-span-2 flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
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
                onClick={handleCancel}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>


      {/* FEATURE LIST */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            Existing Features
          </h2>
        </div>


        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading features...
          </div>
        ) : features.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No homepage features found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {features.map((feature) => (
              <div
                key={feature.id}
                className="p-6 flex flex-col md:flex-row md:items-center gap-5"
              >

                <div className="text-4xl">
                  {feature.icon}
                </div>


                <div className="flex-1">

                  <h3 className="font-bold text-lg">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {feature.description}
                  </p>

                  <div className="flex gap-3 mt-3 text-xs">

                    <span className="px-3 py-1 rounded-full bg-gray-100">
                      Order: {feature.sort_order}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full ${
                        feature.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {feature.status}
                    </span>

                  </div>

                </div>


                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      handleEdit(feature)
                    }
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(feature.id)
                    }
                    className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
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
}