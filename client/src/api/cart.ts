import { apiClient } from "./client";

export interface CartItemResponse {
  productId: number;
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  totalAmount: number;
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await apiClient.get<CartResponse>("/Cart");
  return response.data;
};

export const addOrUpdateCartItem = async (
  productId: number,
  quantity: number,
): Promise<CartResponse> => {
  const response = await apiClient.post<CartResponse>("/Cart/items", {
    productId,
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (
  productId: number,
): Promise<CartResponse> => {
  const response = await apiClient.delete<CartResponse>(
    `/Cart/items/${productId}`,
  );
  return response.data;
};

export const clearServerCart = async (): Promise<void> => {
  await apiClient.delete("/Cart");
};
