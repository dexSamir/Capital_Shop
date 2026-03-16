import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: boolean;
  age: number;
}

export interface AuthResponse {
  token: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

export interface MeResponse {
  id: string;
  email: string;
  fullName: string;
}

export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/Auth/login", payload);
  return response.data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const response = await apiClient.post("/Auth/register", payload);
  return response.data;
};

export const getMeApi = async (): Promise<MeResponse> => {
  const response = await apiClient.get<MeResponse>("/Auth/me");
  return response.data;
};
