import { apiClient, getImageUrl } from "../api/client";

interface CategoryDto {
  id: number;
  title?: string;
  name?: string;
}

interface BrandDto {
  id: number;
  title?: string;
  name?: string;
}

let categoriesCache: CategoryDto[] | null = null;
let brandsCache: BrandDto[] | null = null;

export async function getCategories(): Promise<CategoryDto[]> {
  if (categoriesCache) return categoriesCache;
  try {
    const response = await apiClient.get<CategoryDto[]>("/Categories/GetAll");
    categoriesCache = response.data;
    return categoriesCache;
  } catch {
    return [];
  }
}

export async function getBrands(): Promise<BrandDto[]> {
  if (brandsCache) return brandsCache;
  try {
    const response = await apiClient.get<BrandDto[]>("/Brands/GetAll");
    brandsCache = response.data;
    return brandsCache;
  } catch {
    return [];
  }
}

export async function getAllproducts(filters?: {
  categoryId?: number;
  brandId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.categoryId) params.append("CategoryId", filters.categoryId.toString());
  if (filters?.brandId) params.append("BrandId", filters.brandId.toString());
  if (filters?.search) params.append("Search", filters.search);
  if (filters?.minPrice) params.append("MinPrice", filters.minPrice.toString());
  if (filters?.maxPrice) params.append("MaxPrice", filters.maxPrice.toString());

  const [productsResponse, categories] = await Promise.all([
    apiClient.get(`/Products/GetAll?${params.toString()}`),
    getCategories(),
  ]);

  const data = productsResponse.data as Array<{
    id: number;
    title: string;
    coverImage: string;
    secondImage?: string;
    sellPrice: number;
    discount: number;
    categoryId: number;
    brandId?: number;
  }>;

  const categoryMap = new Map(
    categories.map((c) => [c.id, c.title || c.name || `Category ${c.id}`]),
  );

  return data.map((p) => {
    const price = Number(p.sellPrice);
    const discount = p.discount || 0;
    const withoutDiscount =
      discount > 0 && discount < 100
        ? Number((price / (1 - discount / 100)).toFixed(2))
        : price;

    return {
      id: p.id,
      name: p.title,
      price,
      withoutDiscount,
      img: getImageUrl(p.coverImage),
      secondImg: p.secondImage ? getImageUrl(p.secondImage) : undefined,
      category: categoryMap.get(p.categoryId) || `Category ${p.categoryId}`,
    };
  });
}

export async function deleteProducts(id: string | number) {
  await apiClient.delete(`/Products/Delete/Hard`, {
    params: { ids: id },
  });
}
