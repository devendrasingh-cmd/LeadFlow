import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Other",
  status: "New",
  value: "",
  notes: ""
};

const statuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost"
];

const sources = [
  "Website",
  "Referral",
  "LinkedIn",
  "Email",
  "Cold Call",
  "Other"
];

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingLead, setEditingLead] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/leads", {
        params: {
          search: search || undefined,
          status: statusFilter || undefined
        }
      });

      setLeads(response.data?.leads || []);
    } catch (err) {
      console.error("Loading leads failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load leads."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLeads();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingLead(null);
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        value: Number(form.value) || 0
      };

      if (editingLead) {
        await api.patch(
          `/leads/${editingLead._id}`,
          payload
        );
      } else {
        await api.post("/leads", payload);
      }

      resetForm();
      await loadLeads();
    } catch (err) {
      console.error("Saving lead failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to save lead."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);

    setForm({
      name: lead.name || "",
      email: lead.email || "",
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "Other",
      status: lead.status || "New",
      value: lead.value || "",
      notes: lead.notes || ""
    });

    setShowForm(true);
    setError("");
  };

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(
      `Delete "${lead.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/leads/${lead._id}`);

      await loadLeads();
    } catch (err) {
      console.error("Deleting lead failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to delete lead."
      );
    }
  };

  return (
    <div className="leads-page">

      <header className="leads-header">

        <div className="leads-brand">

          <Link to="/dashboard">
            LeadPilot
          </Link>

          <span>/</span>

          <strong>Leads</strong>

        </div>

        <nav className="leads-nav">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link
            className="leads-nav-active"
            to="/leads"
          >
            Leads
          </Link>

        </nav>

      </header>

      <main className="leads-container">

        <section className="leads-page-heading">

          <div>

            <p className="leads-eyebrow">
              SALES PIPELINE
            </p>

            <h1>Leads</h1>

            <p>
              Manage your prospects and keep your pipeline moving.
            </p>

          </div>

          <button
            className="leads-primary-button"
            onClick={() => {
              setEditingLead(null);
              setForm(initialForm);
              setShowForm(true);
              setError("");
            }}
          >
            + Add lead
          </button>

        </section>

        {error && (
          <div className="leads-error">
            {error}
          </div>
        )}

        <section className="leads-toolbar">

          <div className="leads-search">

            <span>?</span>

            <input
              type="text"
              placeholder="Search name, email or company..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">
              All statuses
            </option>

            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}

          </select>

        </section>

        {showForm && (
          <section className="lead-form-card">

            <div className="lead-form-header">

              <div>

                <h2>
                  {editingLead
                    ? "Edit lead"
                    : "Add a new lead"}
                </h2>

                <p>
                  Enter the prospect details below.
                </p>

              </div>

              <button
                className="lead-close-button"
                onClick={resetForm}
                type="button"
              >
                ×
              </button>

            </div>

            <form
              className="lead-form"
              onSubmit={handleSubmit}
            >

              <div className="lead-form-grid">

                <div className="lead-field">
                  <label>Name *</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="lead-field">
                  <label>Email *</label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div className="lead-field">
                  <label>Phone</label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="lead-field">
                  <label>Company</label>

                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                  />
                </div>

                <div className="lead-field">
                  <label>Source</label>

                  <select
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                  >
                    {sources.map((source) => (
                      <option
                        key={source}
                        value={source}
                      >
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lead-field">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="lead-field">
                  <label>Deal value</label>

                  <input
                    name="value"
                    type="number"
                    min="0"
                    value={form.value}
                    onChange={handleChange}
                    placeholder="50000"
                  />
                </div>

                <div className="lead-field lead-field-full">

                  <label>Notes</label>

                  <textarea
                    name="notes"
                    rows="3"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add useful notes about this lead..."
                  />

                </div>

              </div>

              <div className="lead-form-actions">

                <button
                  type="button"
                  className="leads-secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="leads-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingLead
                      ? "Save changes"
                      : "Create lead"}
                </button>

              </div>

            </form>

          </section>
        )}

        <section className="leads-table-card">

          <div className="leads-table-heading">

            <div>

              <h2>
                All leads
              </h2>

              <p>
                {leads.length}{" "}
                {leads.length === 1
                  ? "lead"
                  : "leads"}{" "}
                found
              </p>

            </div>

          </div>

          {loading ? (

            <div className="leads-loading">
              Loading leads...
            </div>

          ) : leads.length === 0 ? (

            <div className="leads-empty">

              <div className="leads-empty-icon">
                +
              </div>

              <h3>
                No leads found
              </h3>

              <p>
                {search || statusFilter
                  ? "Try changing your search or filter."
                  : "Add your first lead to start building your pipeline."}
              </p>

              {!search && !statusFilter && (
                <button
                  className="leads-primary-button"
                  onClick={() => {
                    setShowForm(true);
                    setError("");
                  }}
                >
                  Add your first lead
                </button>
              )}

            </div>

          ) : (

            <div className="leads-table-wrapper">

              <table className="leads-table">

                <thead>

                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {leads.map((lead) => (

                    <tr key={lead._id}>

                      <td>

                        <div className="lead-person">

                          <div className="lead-avatar">
                            {lead.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {lead.name}
                            </strong>

                            <span>
                              {lead.email}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {lead.company || "—"}
                      </td>

                      <td>
                        {lead.source || "Other"}
                      </td>

                      <td>

                        <span
                          className={`lead-status lead-status-${lead.status
                            ?.toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {lead.status}
                        </span>

                      </td>

                      <td>
                        ?{Number(
                          lead.value || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>

                        <div className="lead-actions">

                          <button
                            onClick={() =>
                              handleEdit(lead)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-action"
                            onClick={() =>
                              handleDelete(lead)
                            }
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

        </section>

      </main>

    </div>
  );
}

