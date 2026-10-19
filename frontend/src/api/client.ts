import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TOKEN_STORAGE_KEY = "pulsewatch_token";

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
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
        if (error.response?.status === 401) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
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
    const response = await this.client.get<[]>(`/api/v1/monitors`);
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

  async getHealthChecks(monitorId: number, page = 0, size = 20) {
    const response = await this.client.get(`/api/v1/health-checks/monitor/${monitorId}`, {
      params: { page, size },
    });
    return response.data;
  }

  async getIncidents() {
    const response = await this.client.get<[]>(`/api/v1/incidents`);
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
}

export const apiClient = new ApiClient();