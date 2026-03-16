import { apiClient } from "./client";

export interface CartItemDto {
  productId: number;
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

export interface CartDto {
  id: number;
  items: CartItemDto[];
  totalAmount: number;
}

export const getCart = async (): Promise<CartDto> => {
  const response = await apiClient.get<CartDto>("/Cart");
  return response.data;
};

export const addOrUpdateCartItem = async (
  productId: number,
  quantity: number,
): Promise<CartDto> => {
  const response = await apiClient.post<CartDto>("/Cart/items", {
    productId,
    quantity,
  });
  return response.data;
};

export const removeCartItem = async (productId: number): Promise<CartDto> => {
  const response = await apiClient.delete<CartDto>(
    `/Cart/items/${productId}`,
  );
  return response.data;
};

export const clearCart = async (): Promise<void> => {
  await apiClient.delete("/Cart");
};
