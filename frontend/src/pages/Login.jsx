import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        email,
        password
      );

      // Login successful.
      // Go directly to workspace setup.
      navigate("/workspace", {
        replace: true
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to sign in. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <img className="brand-icon" src="/leadpilot-logo.svg" alt="LeadPilot" />

          <span>
            LeadPilot
          </span>
        </div>

        <div className="auth-brand-content">
          <h2>
            Turn conversations into customers.
          </h2>

          <p>
            Keep your leads organized,
            follow up at the right time,
            and get a clear view of
            your sales pipeline.
          </p>
        </div>

        <div className="auth-note">
          LeadPilot CRM · Built for growing teams
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">

          <div className="auth-card-header">
            <h1>
              Welcome back
            </h1>

            <p>
              Sign in to continue to
              your LeadPilot workspace.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-field">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          <p className="auth-footer">
            Don't have an account?{" "}

            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>
      </section>
    </main>
  );
}


