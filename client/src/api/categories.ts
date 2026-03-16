import { apiClient } from "./client";

export interface CategoryDto {
  id: number;
  title: string;
  imageUrl?: string;
}

export const fetchCategories = async (): Promise<CategoryDto[]> => {
  const response = await apiClient.get("/Categories/GetAll");
  const data = response.data as Array<{
    id: number;
    title: string;
    imageUrl?: string;
  }>;
  return data;
};

export const createCategory = async (title: string, image: File) => {
  const formData = new FormData();
  formData.append("Title", title);
  formData.append("ImageUrl", image);

  const response = await apiClient.post("/Categories/Create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateCategory = async (id: number, title: string, image?: File) => {
  const formData = new FormData();
  formData.append("Title", title);
  if (image) {
    formData.append("ImageUrl", image);
  }

  const response = await apiClient.patch(`/Categories/Update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCategory = async (id: number) => {
  await apiClient.delete("/Categories/Delete/Hard", {
    params: { ids: id },
  });
};

