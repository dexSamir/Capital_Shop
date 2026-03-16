import { apiClient } from "./client";

export interface BrandDto {
  id: number;
  title: string;
  logoUrl?: string;
  website?: string;
}

export const fetchBrands = async (): Promise<BrandDto[]> => {
  const response = await apiClient.get("/Brands/GetAll");
  const data = response.data as Array<{
    id: number;
    title: string;
    logoUrl?: string;
    website?: string;
  }>;
  return data;
};

export const createBrand = async (
  title: string,
  website: string,
  logo: File,
) => {
  const formData = new FormData();
  formData.append("Title", title);
  formData.append("Website", website);
  formData.append("LogoUrl", logo);

  const response = await apiClient.post("/Brands/Create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBrand = async (
  id: number,
  title: string,
  website: string,
  logo?: File,
) => {
  const formData = new FormData();
  formData.append("Title", title);
  formData.append("Website", website);
  if (logo) {
    formData.append("LogoUrl", logo);
  }

  const response = await apiClient.patch(`/Brands/Update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBrand = async (id: number) => {
  await apiClient.delete("/Brands/Delete/Hard", {
    params: { ids: id },
  });
};

