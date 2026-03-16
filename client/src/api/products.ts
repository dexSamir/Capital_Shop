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

export interface ProductApiItem {
  id: number;
  title: string;
  coverImage: string;
  secondImage?: string;
  sellPrice: number;
  costPrice: number;
  discount: number;
  quantity: number;
  sku: string;
  categoryId: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  description?: string;
}

export const fetchProducts = async (): Promise<ProductApiItem[]> => {
  const response = await apiClient.get("/Products/GetAllAsync");
  return response.data as ProductApiItem[];
};

export const fetchProductById = async (id: number | string): Promise<ProductApiItem> => {
  const response = await apiClient.get(`/Products/GetById/${id}`);
  return response.data as ProductApiItem;
};

export const deleteProduct = async (id: number) => {
  await apiClient.delete(`/Products/Delete/Hard`, {
    params: { ids: id },
  });
};

const buildProductFormData = (payload: AdminProductPayload): FormData => {
  const formData = new FormData();
  formData.append("SellPrice", String(payload.sellPrice));
  formData.append("CostPrice", String(payload.costPrice));
  formData.append("Discount", String(payload.discount));
  formData.append("Quantity", String(payload.quantity));
  formData.append("SKU", payload.sku);
  formData.append("Title", payload.title);
  formData.append("Description", payload.description);
  formData.append("BrandId", String(payload.brandId));
  formData.append("CategoryId", String(payload.categoryId));
  formData.append("Weight", "0");

  if (payload.coverImage) {
    formData.append("CoverImage", payload.coverImage);
  }
  if (payload.secondImage) {
    formData.append("SecondImage", payload.secondImage);
  }
  return formData;
};

export const createProduct = async (payload: AdminProductPayload) => {
  const formData = buildProductFormData(payload);
  const response = await apiClient.post("/Products/Create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProduct = async (
  id: number,
  payload: AdminProductPayload,
) => {
  const formData = buildProductFormData(payload);
  const response = await apiClient.patch(`/Products/Update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
