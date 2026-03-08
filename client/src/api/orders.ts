import { apiClient } from "./client";

export interface AdminOrder {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
}

export const fetchAllOrders = async (): Promise<AdminOrder[]> => {
  const response = await apiClient.get<AdminOrder[]>("/Orders");
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await apiClient.patch(`/Orders/${id}/status`, {
    status,
  });
  return response.data;
};

