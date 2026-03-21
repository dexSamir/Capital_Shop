import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { apiClient, getImageUrl } from "../../api/client";
import { getCategories, getBrands } from "../../middleware/products";

export interface Product {
  id: number;
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  secondImg?: string;
  category: string;
  size?: string;
  color?: string;
  brand?: string;
  images?: string[];
  videoUrl?: string;
  sku?: string;
  description?: string;
  costPrice?: number;
  discount?: number;
  quantity?: number;
  categoryId?: number;
  brandId?: number;
}

interface ProductsState {
  items: Product[];
  filteredItems: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    brand: string;
    search: string;
    sortBy: string;
    sortOrder: string;
    priceMin: string;
    priceMax: string;
  };
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: "All",
    brand: "All",
    search: "",
    sortBy: "",
    sortOrder: "",
    priceMin: "0",
    priceMax: "1000",
  },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any; // typing as any or RootState equivalent
      const { category, brand, search, priceMin, priceMax } = state.products.filters;

      const [categories, brands] = await Promise.all([
        getCategories(),
        getBrands(),
      ]);

      const params = new URLSearchParams();
      if (category && category !== "All") {
        const cat = categories.find((c: any) => c.name === category);
        if (cat) params.append("CategoryId", cat.id.toString());
      }
      if (brand && brand !== "All") {
        const br = brands.find((b: any) => b.name === brand);
        if (br) params.append("BrandId", br.id.toString());
      }
      if (search) params.append("Search", search);
      if (priceMin && priceMin !== "0") params.append("MinPrice", priceMin);
      if (priceMax && priceMax !== "1000") params.append("MaxPrice", priceMax);

      const response = await apiClient.get(`/Products/GetAll?${params.toString()}`);
      const data = response.data as Array<{
        id: number;
        title: string;
        coverImage: string;
        secondImage?: string;
        sellPrice: number;
        costPrice?: number;
        discount: number;
        quantity?: number;
        sku?: string;
        description?: string;
        categoryId: number;
        brandId?: number;
      }>;

      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
      const brandMap = new Map(brands.map((b) => [b.id, b.name]));

      const mapped: Product[] = data.map((p) => {
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
          brand:
            p.brandId != null
              ? brandMap.get(p.brandId) || "Unknown"
              : undefined,
          sku: p.sku,
          description: p.description,
          costPrice: p.costPrice,
          discount: p.discount,
          quantity: p.quantity,
          categoryId: p.categoryId,
          brandId: p.brandId,
        };
      });

      return mapped;
    } catch (error) {
      return rejectWithValue("Failed to fetch products");
    }
  },
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/Products/GetById/${id}`);
      const p = response.data as {
        id: number;
        title: string;
        coverImage: string;
        secondImage?: string;
        sellPrice: number;
        costPrice?: number;
        discount: number;
        quantity?: number;
        sku?: string;
        description?: string;
        categoryId: number;
        brandId?: number;
        images?: string[];
        videoUrl?: string;
      };

      const price = Number(p.sellPrice);
      const discount = p.discount || 0;
      const withoutDiscount =
        discount > 0 && discount < 100
          ? Number((price / (1 - discount / 100)).toFixed(2))
          : price;

      const categories = await getCategories();
      const brands = await getBrands();
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
      const brandMap = new Map(brands.map((b) => [b.id, b.name]));

      const mapped: Product = {
        id: p.id,
        name: p.title,
        price,
        withoutDiscount,
        img: getImageUrl(p.coverImage),
        secondImg: p.secondImage ? getImageUrl(p.secondImage) : undefined,
        category: categoryMap.get(p.categoryId) || `Category ${p.categoryId}`,
        brand:
          p.brandId != null ? brandMap.get(p.brandId) || "Unknown" : undefined,
        images: p.images ? p.images.map(img => getImageUrl(img)) : [],
        videoUrl: p.videoUrl,
        sku: p.sku,
        description: p.description,
        costPrice: p.costPrice,
        discount: p.discount,
        quantity: p.quantity,
        categoryId: p.categoryId,
        brandId: p.brandId,
      };

      return mapped;
    } catch (error) {
      return rejectWithValue("Failed to fetch product");
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/Products/Delete/Hard`, {
        params: { ids: id },
      });
      return id;
    } catch (error) {
      return rejectWithValue("Failed to delete product");
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: string; value: string }>,
    ) => {
      const { key, value } = action.payload;
      state.filters = {
        ...state.filters,
        [key]: value,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        category: "All",
        brand: "All",
        search: "",
        sortBy: "",
        sortOrder: "",
        priceMin: "0",
        priceMax: "1000",
      };
      state.filteredItems = state.items;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.filteredItems = state.filteredItems.filter(
          (item) => item.id !== action.payload,
        );
      });
  },
});

export const { setFilter, resetFilters, clearSelectedProduct } =
  productSlice.actions;
export default productSlice.reducer;
