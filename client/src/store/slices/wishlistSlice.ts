import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const loadWishlistFromStorage = (): WishlistItem[] => {
  try {
    const wishlistItems = localStorage.getItem("wishlist");
    return wishlistItems ? JSON.parse(wishlistItems) : [];
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
    return [];
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.items.push(newItem);
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    toggleWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex >= 0) {
        state.items.splice(existingItemIndex, 1);
      } else {
        state.items.push(newItem);
      }

      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem("wishlist");
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlistItem,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
