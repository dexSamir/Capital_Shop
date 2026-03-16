import { apiClient } from "./client";

export interface LoginPayload {
  emailOrUserName: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/Auth/login", payload);
  return response.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/Auth/register",
    payload,
  );
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/Auth/me");
  return response.data;
};
