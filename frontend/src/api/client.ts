import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const TOKEN_STORAGE_KEY = "pwwatch_token";
const USER_STORAGE_KEY = "pwwatch_user";

export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

function extractMessage(error: any): string {
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.error) return data.error;
    if (data.message) return data.message;
    // Field-level validation errors (Map<String,String> from backend)
    const entries = Object.entries(data);
    if (entries.length > 0 && entries.every(([, v]) => typeof v === "string")) {
      return Object.values(data).join(" ");
    }
  }
  if (error?.message) return error.message;
  return "An unexpected error occurred";
}

function extractFields(error: any): Record<string, string> {
  if (error?.response?.data && typeof error.response.data === "object") {
    const data = error.response.data;
    if (data.error === undefined && data.message === undefined) {
      const entries = Object.entries(data);
      if (entries.length > 0 && entries.every(([, v]) => typeof v === "string")) {
        return data as Record<string, string>;
      }
    }
  }
  return {};
}

export class ApiClient {
  private client: AxiosInstance;
  private onUnauthenticatedHandler: (() => void) | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: any) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          if (this.onUnauthenticatedHandler) {
            this.onUnauthenticatedHandler();
          }
        }
        const apiError = new ApiError(extractMessage(error), error.response?.status || 500, extractFields(error));
        return Promise.reject(apiError);
      }
    );
  }

  onUnauthenticated(callback: () => void) {
    this.onUnauthenticatedHandler = callback;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  setUser(user: AuthResponse): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  getUser(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async register(data: { email: string; password: string; fullName: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/api/v1/auth/register", data);
    return response.data;
  }

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>("/api/v1/auth/login", data);
    return response.data;
  }

  async getMonitors() {
    const response = await this.client.get(`/api/v1/monitors`);
    return response.data;
  }

  async createMonitor(data: { name: string; url: string; intervalMinutes?: number; timeoutMs?: number; failureThreshold?: number }) {
    const response = await this.client.post(`/api/v1/monitors`, data);
    return response.data;
  }

  async getMonitor(id: number) {
    const response = await this.client.get(`/api/v1/monitors/${id}`);
    return response.data;
  }

  async updateMonitor(id: number, data: { name?: string; url?: string; intervalMinutes?: number; timeoutMs?: number; failureThreshold?: number; enabled?: boolean }) {
    const response = await this.client.put(`/api/v1/monitors/${id}`, data);
    return response.data;
  }

  async pauseMonitor(id: number) {
    const response = await this.client.post(`/api/v1/monitors/${id}/pause`);
    return response.data;
  }

  async resumeMonitor(id: number) {
    const response = await this.client.post(`/api/v1/monitors/${id}/resume`);
    return response.data;
  }

  async deleteMonitor(id: number) {
    const response = await this.client.delete(`/api/v1/monitors/${id}`);
    return response.data;
  }

  async checkNow(id: number) {
    const response = await this.client.post(`/api/v1/monitors/${id}/check`);
    return response.data;
  }

  async getHealthChecks(monitorId: number, page = 0, size = 20) {
    const response = await this.client.get(`/api/v1/health-checks/monitor/${monitorId}`, {
      params: { page, size },
    });
    return response.data;
  }

  async getIncidents() {
    const response = await this.client.get(`/api/v1/incidents`);
    return response.data;
  }

  async getIncident(id: number) {
    const response = await this.client.get(`/api/v1/incidents/${id}`);
    return response.data;
  }

  async acknowledgeIncident(id: number, acknowledgedBy: string) {
    const response = await this.client.post(`/api/v1/incidents/${id}/acknowledge`, { acknowledgedBy });
    return response.data;
  }

  async getDashboardSummary() {
    const response = await this.client.get(`/api/v1/dashboard/summary`);
    return response.data;
  }

  async getDashboardRecentFailures() {
    const response = await this.client.get(`/api/v1/dashboard/recent-failures`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
