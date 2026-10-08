import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const statusClass = (status) => {
  return `dashboard-status status-${status
    ?.toLowerCase()
    .replace(/\s+/g, "-")}`;
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/dashboard");

      setDashboard(response.data?.data || null);
    } catch (err) {
      console.error("Dashboard loading failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error-page">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>

          <button
            className="dashboard-primary-button"
            onClick={loadDashboard}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const recentLeads = dashboard?.recentLeads || [];

  return (
    <div className="dashboard-page">

      <header className="dashboard-header">

        <div className="dashboard-brand">
          <Link to="/dashboard">
            LeadPilot
          </Link>

          <span className="dashboard-divider">
            /
          </span>

          <span>Dashboard</span>
        </div>

        <nav className="dashboard-nav">
          <Link
            className="dashboard-nav-active"
            to="/dashboard"
          >
            Dashboard
          </Link>

          <Link to="/leads">
            Leads
          </Link>
        </nav>

      </header>

      <main className="dashboard-container">

        <section className="dashboard-intro">

          <div>
            <p className="dashboard-eyebrow">
              {dashboard?.workspace?.name || "WORKSPACE"}
            </p>

            <h1>
              Good to see you.
            </h1>

            <p>
              Here is what is happening with your sales pipeline.
            </p>
          </div>

          <Link
            className="dashboard-primary-button"
            to="/leads"
          >
            + Add lead
          </Link>

        </section>

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="stat-label">
              Total leads
            </div>

            <div className="stat-value">
              {stats.totalLeads || 0}
            </div>

            <div className="stat-detail">
              All prospects
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-label">
              Qualified
            </div>

            <div className="stat-value">
              {stats.qualifiedLeads || 0}
            </div>

            <div className="stat-detail">
              Ready for sales
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-label">
              Won deals
            </div>

            <div className="stat-value">
              {stats.wonLeads || 0}
            </div>

            <div className="stat-detail">
              Successfully closed
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="stat-label">
              Pipeline value
            </div>

            <div className="stat-value stat-money">
              ?{Number(
                stats.pipelineValue || 0
              ).toLocaleString("en-IN")}
            </div>

            <div className="stat-detail">
              Total opportunity value
            </div>
          </div>

        </section>

        <section className="dashboard-grid">

          <div className="dashboard-panel">

            <div className="panel-heading">

              <div>
                <h2>Pipeline overview</h2>
                <p>
                  Current lead distribution
                </p>
              </div>

              <Link to="/leads">
                View leads
              </Link>

            </div>

            <div className="pipeline-list">

              <div className="pipeline-row">
                <span>New</span>
                <strong>
                  {stats.newLeads || 0}
                </strong>
              </div>

              <div className="pipeline-row">
                <span>Contacted</span>
                <strong>
                  {stats.contactedLeads || 0}
                </strong>
              </div>

              <div className="pipeline-row">
                <span>Qualified</span>
                <strong>
                  {stats.qualifiedLeads || 0}
                </strong>
              </div>

              <div className="pipeline-row">
                <span>Proposal</span>
                <strong>
                  {stats.proposalLeads || 0}
                </strong>
              </div>

              <div className="pipeline-row pipeline-success">
                <span>Won</span>
                <strong>
                  {stats.wonLeads || 0}
                </strong>
              </div>

              <div className="pipeline-row pipeline-lost">
                <span>Lost</span>
                <strong>
                  {stats.lostLeads || 0}
                </strong>
              </div>

            </div>

          </div>

          <div className="dashboard-panel">

            <div className="panel-heading">

              <div>
                <h2>Conversion rate</h2>
                <p>
                  Leads converted to won deals
                </p>
              </div>

            </div>

            <div className="conversion-content">

              <div className="conversion-circle">
                <span>
                  {stats.conversionRate || 0}%
                </span>
              </div>

              <div className="conversion-copy">

                <strong>
                  {stats.wonLeads || 0} won
                </strong>

                <span>
                  out of {stats.totalLeads || 0} total leads
                </span>

              </div>

            </div>

          </div>

        </section>

        <section className="dashboard-panel recent-panel">

          <div className="panel-heading">

            <div>
              <h2>Recent leads</h2>
              <p>
                Your latest prospects
              </p>
            </div>

            <Link to="/leads">
              View all
            </Link>

          </div>

          {recentLeads.length === 0 ? (
            <div className="recent-empty">
              <h3>No leads yet</h3>

              <p>
                Add your first lead to start tracking your
                sales pipeline.
              </p>

              <Link
                className="dashboard-primary-button"
                to="/leads"
              >
                Add first lead
              </Link>
            </div>
          ) : (
            <div className="recent-table-wrapper">

              <table className="recent-table">

                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Value</th>
                  </tr>
                </thead>

                <tbody>

                  {recentLeads.map((lead) => (
                    <tr key={lead._id}>

                      <td>
                        <div className="recent-lead">

                          <div className="recent-avatar">
                            {lead.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {lead.name}
                            </strong>

                            <span>
                              {lead.email || "No email"}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        {lead.company || "—"}
                      </td>

                      <td>
                        <span
                          className={statusClass(
                            lead.status
                          )}
                        >
                          {lead.status}
                        </span>
                      </td>

                      <td>
                        ?{Number(
                          lead.value || 0
                        ).toLocaleString("en-IN")}
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

