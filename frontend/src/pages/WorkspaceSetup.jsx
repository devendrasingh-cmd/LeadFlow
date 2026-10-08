import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function WorkspaceSetup() {
  const navigate = useNavigate();
  const { user, createWorkspace } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const workspaceName = name.trim();

    if (!workspaceName) {
      setError("Please enter a workspace name.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createWorkspace(workspaceName);

      // Workspace creation successful.
      // Go directly to the application dashboard.
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Workspace creation failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to create workspace. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.07)"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px"
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#0f172a",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "18px"
            }}
          >
            L
          </div>

          <span
            style={{
              fontSize: "20px",
              fontWeight: 750,
              color: "#0f172a"
            }}
          >
            LeadPilot
          </span>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 600
            }}
          >
            Welcome{user?.name ? `, ${user.name}` : ""}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              color: "#0f172a"
            }}
          >
            Create your workspace
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              color: "#64748b",
              fontSize: "14px",
              lineHeight: 1.6
            }}
          >
            Your workspace is where you will manage leads,
            customers and your sales pipeline.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="workspace-name"
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#334155",
              fontSize: "14px",
              fontWeight: 650
            }}
          >
            Workspace name
          </label>

          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Acme Realty"
            maxLength={100}
            autoFocus
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              height: "48px",
              padding: "0 14px",
              border: "1px solid #cbd5e1",
              borderRadius: "9px",
              outline: "none",
              fontSize: "14px",
              color: "#0f172a",
              background: "#ffffff"
            }}
          />

          {error && (
            <div
              style={{
                marginTop: "12px",
                padding: "11px 13px",
                borderRadius: "8px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#b91c1c",
                fontSize: "13px",
                lineHeight: 1.5
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "48px",
              marginTop: "18px",
              border: 0,
              borderRadius: "9px",
              background: loading ? "#64748b" : "#0f172a",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading
              ? "Creating workspace..."
              : "Create workspace"}
          </button>
        </form>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "20px",
            borderTop: "1px solid #e2e8f0",
            color: "#94a3b8",
            fontSize: "12px",
            lineHeight: 1.5,
            textAlign: "center"
          }}
        >
          You can manage your workspace settings later.
        </div>
      </div>
    </div>
  );
}

