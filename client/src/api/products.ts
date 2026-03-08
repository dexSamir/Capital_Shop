import { apiClient } from "./client";

export interface AdminProductPayload {
  id?: number;
  title: string;
  description: string;
  sellPrice: number;
  costPrice: number;
  discount: number;
  quantity: number;
  sku: string;
  brandId: number;
  categoryId: number;
  coverImage?: File | null;
  secondImage?: File | null;
}

export const createProduct = async (payload: AdminProductPayload) => {
  const formData = new FormData();
  formData.append("SellPrice", String(payload.sellPrice));
  formData.append("CostPrice", String(payload.costPrice));
  formData.append("Discount", String(payload.discount));
  formData.append("Quantity", String(payload.quantity));
  formData.append("SKU", payload.sku);
  formData.append("Title", payload.title);
  formData.append("Description", payload.description);
  formData.append("BrandId", String(payload.brandId));
  formData.append("CaategoryId", String(payload.categoryId));
  formData.append("Weight", "0");

  if (payload.coverImage) {
    formData.append("CoverImage", payload.coverImage);
  }
  if (payload.secondImage) {
    formData.append("SecondImage", payload.secondImage);
  }

  const response = await apiClient.post("/Products/Create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  payload: AdminProductPayload,
) => {
  const formData = new FormData();

  formData.append("SellPrice", String(payload.sellPrice));
  formData.append("CostPrice", String(payload.costPrice));
  formData.append("Discount", String(payload.discount));
  formData.append("Quantity", String(payload.quantity));
  formData.append("SKU", payload.sku);
  formData.append("Title", payload.title);
  formData.append("Description", payload.description);
  formData.append("BrandId", String(payload.brandId));
  formData.append("CaategoryId", String(payload.categoryId));
  formData.append("Weight", "0");

  if (payload.coverImage) {
    formData.append("CoverImage", payload.coverImage);
  }
  if (payload.secondImage) {
    formData.append("SecondImage", payload.secondImage);
  }

  const response = await apiClient.patch(`/Products/Update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
