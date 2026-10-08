import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppHeader({ current = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">

      <div className="app-header-left">
        <Link to="/dashboard" className="app-logo">
          <img className="app-logo-mark" src="/leadpilot-logo.svg" alt="LeadPilot" />
          LeadPilot
        </Link>

        <nav className="app-nav">
          <Link
            to="/dashboard"
            className={current === "dashboard" ? "active" : ""}
          >
            Dashboard
          </Link>

          <Link
            to="/leads"
            className={current === "leads" ? "active" : ""}
          >
            Leads
          </Link>
        </nav>
      </div>

      <div className="app-header-right">

        <div className="app-user">
          <div className="app-user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="app-user-info">
            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              {user?.email || ""}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="app-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  );
}


