import { apiClient } from "./client";

export interface ProductSpecificationDto {
  id: number;
  key: string;
  value: string;
}

export const getSpecificationsByProductId = async (productId: number): Promise<ProductSpecificationDto[]> => {
  const response = await apiClient.get(`/ProductSpecifications/product/${productId}`);
  return response.data;
};

export const createSpecification = async (productId: number, key: string, value: string) => {
  const response = await apiClient.post(`/ProductSpecifications`, { productId, key, value });
  return response.data;
};

export const updateSpecification = async (id: number, key: string, value: string) => {
  const response = await apiClient.patch(`/ProductSpecifications/${id}`, { key, value });
  return response.data;
};

export const deleteSpecification = async (id: number) => {
  const response = await apiClient.delete(`/ProductSpecifications/${id}`);
  return response.data;
};
