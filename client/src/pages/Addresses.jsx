
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Addresses.css";

const emptyAddress = {
  name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  address_type: "home",
  is_default: false,
};

const unwrap = (response) => response?.data ?? response;

function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = unwrap(await api.get("/addresses"));
      setAddresses(
        Array.isArray(response?.addresses) ? response.addresses : []
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your addresses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadAddresses();
  }, [navigate, loadAddresses]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyAddress);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address.id);
    setForm({
      name: address.name || "",
      phone: address.phone || "",
      address_line1: address.address_line1 || "",
      address_line2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      landmark: address.landmark || "",
      address_type: address.address_type || "home",
      is_default: Boolean(address.is_default),
    });
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        is_default: Boolean(form.is_default),
      };

      if (editingId) {
        await api.put(`/addresses/${editingId}`, payload);
        setMessage("Address updated successfully.");
      } else {
        await api.post("/addresses", payload);
        setMessage("Address added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyAddress);
      await loadAddresses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save the address."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/addresses/${id}`);
      setMessage("Address deleted successfully.");
      await loadAddresses();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete the address."
      );
    }
  };

  const handleSetDefault = async (id) => {
    try {
      setError("");
      setMessage("");

      await api.put(`/addresses/${id}/default`);
      setMessage("Default delivery address updated.");
      await loadAddresses();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the default address."
      );
    }
  };

  if (loading) {
    return <div className="addresses-page">Loading your addresses...</div>;
  }

  return (
    <main className="addresses-page">
      <div className="addresses-container">
        <div className="addresses-heading">
          <div>
            <h1>My Addresses</h1>
            <p>Manage your delivery addresses.</p>
          </div>

          {!showForm && (
            <button className="address-add-btn" onClick={openAddForm}>
              + Add New Address
            </button>
          )}
        </div>

        {error && <div className="address-alert error">{error}</div>}
        {message && <div className="address-alert success">{message}</div>}

        {showForm && (
          <section className="address-form-card">
            <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="address-form-grid">
                <label>
                  Full Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Enter full name"
                  />
                </label>

                <label>
                  Phone Number *
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    maxLength={20}
                    placeholder="Enter phone number"
                  />
                </label>

                <label className="full-width">
                  Address Line 1 *
                  <input
                    name="address_line1"
                    value={form.address_line1}
                    onChange={handleChange}
                    required
                    maxLength={255}
                    placeholder="House number, street name"
                  />
                </label>

                <label className="full-width">
                  Address Line 2
                  <input
                    name="address_line2"
                    value={form.address_line2}
                    onChange={handleChange}
                    placeholder="Area, locality (optional)"
                  />
                </label>

                <label>
                  City *
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  State *
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  PIN Code *
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    maxLength={10}
                    placeholder="Enter PIN code"
                  />
                </label>

                <label>
                  Landmark
                  <input
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder="Nearby landmark"
                  />
                </label>

                <label>
                  Address Type
                  <select
                    name="address_type"
                    value={form.address_type}
                    onChange={handleChange}
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>

              <label className="default-address-option">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                />
                Set as my default delivery address
              </label>

              <div className="address-form-actions">
                <button
                  type="submit"
                  className="address-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Address"
                      : "Save Address"}
                </button>

                <button
                  type="button"
                  className="address-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyAddress);
                    setError("");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {!showForm && addresses.length === 0 && (
          <div className="address-empty">
            <h2>No addresses found</h2>
            <p>Add your first delivery address to continue shopping.</p>
            <button className="address-add-btn" onClick={openAddForm}>
              Add Your First Address
            </button>
          </div>
        )}

        <div className="address-list">
          {addresses.map((address) => (
            <article className="address-card" key={address.id}>
              <div className="address-card-top">
                <div>
                  <h3>{address.name}</h3>
                  <span className="address-type">
                    {(address.address_type || "home").toUpperCase()}
                  </span>
                </div>

                {Boolean(address.is_default) && (
                  <span className="default-address-badge">Default</span>
                )}
              </div>

              <p>{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              {address.landmark && <p>Landmark: {address.landmark}</p>}
              <p>
                {address.city}, {address.state} - {address.pincode}
              </p>
              <p>Phone: {address.phone}</p>

              <div className="address-card-actions">
                <button onClick={() => openEditForm(address)}>
                  Edit
                </button>

                <button
                  className="address-delete-btn"
                  onClick={() => handleDelete(address.id)}
                >
                  Delete
                </button>

                {!Boolean(address.is_default) && (
                  <button
                    className="address-default-btn"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Addresses;
