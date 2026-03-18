import { apiClient } from "./client";

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

export const fetchAllUsers = async (): Promise<UserDto[]> => {
  const { data } = await apiClient.get<UserDto[]>("/users");
  return data;
};

export const assignRole = async (userId: string, roleName: string): Promise<void> => {
  await apiClient.post(`/users/${userId}/roles`, { roleName });
};

export const removeRole = async (userId: string, roleName: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}/roles`, {
    data: { roleName }
  });
};
