
import { useEffect, useState } from "react";
import api from "../../services/api";

const initialForm = {
  category_id: "",
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  sale_price: "",
  stock_quantity: "",
  unit: "piece",
  weight: "",
  status: "active",
  featured: false,
};

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
      ]);

      const productsData = productsResponse.data ?? productsResponse;
      const categoriesData = categoriesResponse.data ?? categoriesResponse;

      if (!productsData.success) {
        throw new Error(productsData.message || "Could not load products.");
      }

      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load products and categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => {
      const updated = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "name" && !editingId) {
        updated.slug = makeSlug(value);
      }

      return updated;
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      category_id: product.category_id ?? "",
      name: product.name ?? "",
      slug: product.slug ?? "",
      sku: product.sku ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      sale_price: product.sale_price ?? "",
      stock_quantity: product.stock_quantity ?? "",
      unit: product.unit ?? "piece",
      weight: product.weight ?? "",
      status: product.status ?? "active",
      featured: Boolean(product.featured),
    });

    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        slug: form.slug || makeSlug(form.name),
        price: Number(form.price),
        sale_price:
          form.sale_price === "" ? null : Number(form.sale_price),
        stock_quantity: Number(form.stock_quantity),
        weight: form.weight === "" ? null : Number(form.weight),
        featured: form.featured ? 1 : 0,
      };

      const response = editingId
        ? await api.put(`/products/${editingId}`, payload)
        : await api.post("/products", payload);

      const data = response.data ?? response;

      if (!data.success) {
        throw new Error(data.message || "Could not save product.");
      }

      setMessage(
        editingId
          ? "Product updated successfully."
          : "Product created successfully."
      );

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await api.delete(`/products/${product.id}`);
      const data = response.data ?? response;

      if (!data.success) {
        throw new Error(data.message || "Could not delete product.");
      }

      setMessage("Product deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete product."
      );
    }
  };

  return (
    <div style={{ padding: "24px", width: "100%" }}>
      <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: 20 }}>
        Product Management
      </h1>

      {error && (
        <p style={{ color: "#b91c1c", marginBottom: 15 }}>{error}</p>
      )}

      {message && (
        <p style={{ color: "#15803d", marginBottom: 15 }}>{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: 20,
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          marginBottom: 30,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <h2 style={{ gridColumn: "1 / -1", fontSize: 20, fontWeight: 600 }}>
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          style={fieldStyle}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          required
          style={fieldStyle}
        />

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Product slug"
          required
          style={fieldStyle}
        />

        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          required
          style={fieldStyle}
        />

        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={fieldStyle}
        />

        <input
          name="sale_price"
          type="number"
          min="0"
          step="0.01"
          value={form.sale_price}
          onChange={handleChange}
          placeholder="Sale price (optional)"
          style={fieldStyle}
        />

        <input
          name="stock_quantity"
          type="number"
          min="0"
          value={form.stock_quantity}
          onChange={handleChange}
          placeholder="Stock quantity"
          required
          style={fieldStyle}
        />

        <input
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="Unit (e.g. piece, pack)"
          style={fieldStyle}
        />

        <input
          name="weight"
          type="number"
          min="0"
          step="0.001"
          value={form.weight}
          onChange={handleChange}
          placeholder="Weight (optional)"
          style={fieldStyle}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          style={fieldStyle}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product description"
          rows={3}
          style={{ ...fieldStyle, gridColumn: "1 / -1" }}
        />

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          Featured product
        </label>

        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button type="submit" disabled={saving} style={primaryButton}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Product"
                : "Add Product"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={secondaryButton}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 15 }}>
        Products ({products.length})
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                {[
                  "ID",
                  "Product",
                  "SKU",
                  "Price",
                  "Sale Price",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} style={cellStyle}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={cellStyle}>{product.id}</td>
                  <td style={cellStyle}>{product.name}</td>
                  <td style={cellStyle}>{product.sku}</td>
                  <td style={cellStyle}>₹{product.price}</td>
                  <td style={cellStyle}>
                    {product.sale_price
                      ? `₹${product.sale_price}`
                      : "—"}
                  </td>
                  <td style={cellStyle}>{product.stock_quantity}</td>
                  <td style={cellStyle}>{product.status}</td>
                  <td style={cellStyle}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        style={secondaryButton}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        style={deleteButton}
                      >
                        Delete
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
  );
}

const fieldStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#fff",
};

const cellStyle = {
  padding: 12,
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const primaryButton = {
  padding: "10px 18px",
  border: 0,
  borderRadius: 6,
  background: "#1d4ed8",
  color: "#fff",
  cursor: "pointer",
};

const secondaryButton = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
};

const deleteButton = {
  ...secondaryButton,
  color: "#b91c1c",
  borderColor: "#fecaca",
};
