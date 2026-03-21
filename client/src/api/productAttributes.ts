import { apiClient } from "./client";

export interface ProductAttributeValueDto {
  id: number;
  attributeId: number;
  attributeName: string;
  value: string;
}

export const getProductAttributes = async (productId: number): Promise<ProductAttributeValueDto[]> => {
  const response = await apiClient.post(`/ProductAttributeValues/GetProductAttributes?productId=${productId}`);
  return response.data;
};

export const assignAttributeValueToProduct = async (productId: number, attributeValueId: number) => {
  const response = await apiClient.get(`/ProductAttributeValues/AssignAttributeValueToProduct?productId=${productId}&attributeValueId=${attributeValueId}`);
  return response.data;
};

export const removeAttributeValueFromProduct = async (productId: number, attributeValueId: number) => {
  const response = await apiClient.get(`/ProductAttributeValues/RemoveAttributeValueFromProduct/${productId}?attributeValueId=${attributeValueId}`);
  return response.data;
};
