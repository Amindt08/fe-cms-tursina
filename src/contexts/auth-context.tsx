"use client";

import { API_ENDPOINTS } from "@/app/api/api";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on first render
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("tursina-user");
      const token = sessionStorage.getItem("tursina-token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading session:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        console.error("Login failed:", json.message || "Unknown error");
        return false;
      }

      if (!json.success || !json.data) {
        console.error("Login invalid structure:", json);
        return false;
      }

      const token =
        json.data.token || json.data.access_token || json.token || null;

      if (!token) {
        console.error("Token not found in response:", json);
        return false;
      }

      const userData: User = {
        id: json.data.id.toString(),
        name: json.data.name,
        email: json.data.email,
        role: json.data.role,
      };

      setUser(userData);

      sessionStorage.setItem("tursina-user", JSON.stringify(userData));
      sessionStorage.setItem("tursina-token", token);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("tursina-user");
    sessionStorage.removeItem("tursina-token");
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
