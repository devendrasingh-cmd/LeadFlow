import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("leadflow_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await api.get("/auth/me");

        const currentUser =
          response.data?.data?.user ||
          response.data?.user;

        if (!currentUser) {
          throw new Error("User information unavailable");
        }

        localStorage.setItem(
          "leadflow_user",
          JSON.stringify(currentUser)
        );

        setUser(currentUser);
      } catch (error) {
        console.error("Session validation failed:", error);

        localStorage.removeItem("leadflow_token");
        localStorage.removeItem("leadflow_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    const responseData = response.data?.data;

    if (!responseData?.token || !responseData?.user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem(
      "leadflow_token",
      responseData.token
    );

    localStorage.setItem(
      "leadflow_user",
      JSON.stringify(responseData.user)
    );

    setUser(responseData.user);

    return responseData;
  };

  const register = async (
    name,
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password
      }
    );

    const responseData = response.data?.data;

    if (!responseData?.token || !responseData?.user) {
      throw new Error("Invalid registration response");
    }

    localStorage.setItem(
      "leadflow_token",
      responseData.token
    );

    localStorage.setItem(
      "leadflow_user",
      JSON.stringify(responseData.user)
    );

    setUser(responseData.user);

    return responseData;
  };

  const logout = () => {
    localStorage.removeItem("leadflow_token");
    localStorage.removeItem("leadflow_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
