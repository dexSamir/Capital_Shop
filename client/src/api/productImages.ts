import { apiClient } from "./client";

export interface ProductImageDto {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  isSecondary: boolean;
  altText: string;
}

export const getImagesByProductId = async (productId: number): Promise<ProductImageDto[]> => {
  const response = await apiClient.get(`/ProductImages/GetImagesByProductId/${productId}`);
  return response.data;
};

export const addImages = async (productId: number, formData: FormData) => {
  const response = await apiClient.post(`/ProductImages/AddImages?productId=${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const setPrimaryImage = async (productId: number, imageId: number) => {
  const response = await apiClient.patch(`/ProductImages/SetPrimaryImage?productId=${productId}&imageId=${imageId}`);
  return response.data;
};

export const setSecondaryImage = async (productId: number, imageId: number) => {
  const response = await apiClient.patch(`/ProductImages/SetSecondaryImage?productId=${productId}&imageId=${imageId}`);
  return response.data;
};

export const updateAltText = async (imageId: number, altText: string) => {
  const response = await apiClient.patch(`/ProductImages/UpdateAltText/${imageId}?altText=${altText}`);
  return response.data;
};

export const deleteImages = async (ids: number[], deleteType: number = 0) => {
  const queryParams = ids.map((id) => `ids=${id}`).join("&");
  const response = await apiClient.delete(`/ProductImages/Delete/${deleteType}?${queryParams}`);
  return response.data;
};
