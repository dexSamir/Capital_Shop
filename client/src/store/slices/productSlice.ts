import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { base_url } from "../../data/Data"

export interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
  size?: string
  color?: string
}

interface ProductsState {
  items: Product[]
  filteredItems: Product[]
  selectedProduct: Product | null
  loading: boolean
  error: string | null
  filters: {
    category: string
    size: string
    color: string
    search: string
    sortBy: string
    sortOrder: string
    priceMin: string
    priceMax: string
  }
}

const initialState: ProductsState = {
  items: [],
  filteredItems: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: "All",
    size: "All",
    color: "All",
    search: "",
    sortBy: "",
    sortOrder: "",
    priceMin: "0",
    priceMax: "1000",
  },
}

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${base_url}products`)
    return response.data
  } catch (error) {
    return rejectWithValue("Failed to fetch products")
  }
})

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}products/${id}`)
      return response.data
    } catch (error) {
      return rejectWithValue("Failed to fetch product")
    }
  },
)

export const deleteProduct = createAsyncThunk("products/deleteProduct", async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`${base_url}products/${id}`)
    return id
  } catch (error) {
    return rejectWithValue("Failed to delete product")
  }
})

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      const { key, value } = action.payload
      state.filters = {
        ...state.filters,
        [key]: value,
      }

      state.filteredItems = state.items.filter((product) => {
        const categoryMatch = state.filters.category === "All" || product.category === state.filters.category
        const sizeMatch = state.filters.size === "All" || product.size === state.filters.size
        const colorMatch = state.filters.color === "All" || product.color === state.filters.color
        const searchMatch =
          !state.filters.search || product.name.toLowerCase().includes(state.filters.search.toLowerCase())
        const priceMatch =
          product.price >= Number.parseFloat(state.filters.priceMin) &&
          product.price <= Number.parseFloat(state.filters.priceMax)

        return categoryMatch && sizeMatch && colorMatch && searchMatch && priceMatch
      })

      if (state.filters.sortBy && state.filters.sortOrder) {
        state.filteredItems.sort((a, b) => {
          const sortBy = state.filters.sortBy as keyof Product
          const sortOrder = state.filters.sortOrder

          if (sortBy === "name") {
            return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          } else if (sortBy === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price
          } else if (sortBy === "withoutDiscount") {
            const discountA = ((a.withoutDiscount - a.price) / a.withoutDiscount) * 100
            const discountB = ((b.withoutDiscount - b.price) / b.withoutDiscount) * 100
            return sortOrder === "asc" ? discountA - discountB : discountB - discountA
          }
          return 0
        })
      }
    },
    resetFilters: (state) => {
      state.filters = {
        category: "All",
        size: "All",
        color: "All",
        search: "",
        sortBy: "",
        sortOrder: "",
        priceMin: "0",
        priceMax: "1000",
      }
      state.filteredItems = state.items
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.filteredItems = state.filteredItems.filter((item) => item.id !== action.payload)
      })
  },
})

export const { setFilter, resetFilters, clearSelectedProduct } = productSlice.actions
export default productSlice.reducer
