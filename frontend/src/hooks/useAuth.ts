import { useState, useCallback } from "react";
import { apiClient } from "../api/client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export function useAuth() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(data);
      apiClient.setToken(response.token);
      setUser(response);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(data);
      apiClient.setToken(response.token);
      setUser(response);
      return response;
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.clearToken();
    setUser(null);
    window.location.href = "/login";
  }, []);

  const initializeUser = useCallback(() => {
    const token = apiClient.getToken();
    if (token) {
      const userData = localStorage.getItem("pulsewatch_user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    initializeUser,
    setUser,
  };
}