import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkspaceSetup from "./pages/WorkspaceSetup";
import ProtectedLayout from "./components/ProtectedLayout";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/workspace"
            element={<WorkspaceSetup />}
          />

          <Route element={<ProtectedLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/leads"
              element={<Leads />}
            />

          </Route>

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}
