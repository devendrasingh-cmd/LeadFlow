import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] =
    useState("");

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
      await register(
        name,
        email,
        password
      );

      navigate("/workspace", {
        replace: true
      });

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to create your account."
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
            A simpler way to manage your pipeline.
          </h2>

          <p>
            Bring your leads, follow-ups,
            and sales activity together
            in one focused workspace.
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
              Create your account
            </h1>

            <p>
              Set up your workspace
              and start managing leads.
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-field">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoComplete="name"
                required
              />

            </div>

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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
                minLength={8}
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
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <p className="auth-footer">
            Already have an account?{" "}

            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>

      </section>

    </main>
  );
}


