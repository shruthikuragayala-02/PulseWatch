import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../api/client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export function useAuth() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(data);
      apiClient.setToken(response.token);
      apiClient.setUser(response);
      setUser(response);
      return response;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Login failed";
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
      apiClient.setUser(response);
      setUser(response);
      return response;
    } catch (err: any) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.clearToken();
    setUser(null);
    setError(null);
    window.location.href = "/login";
  }, []);

  const initializeUser = useCallback(() => {
    const token = apiClient.getToken();
    if (token) {
      const storedUser = apiClient.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return {
    user,
    loading,
    error,
    initialized,
    login,
    register,
    logout,
    isAuthenticated: initialized && !!user,
    setUser,
  };
}
