import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  addOrUpdateCartItem,
  removeCartItem,
  clearServerCart,
} from "../../api/cart";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  category: string;
  count: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const cartItems = localStorage.getItem("basket");
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem("basket", JSON.stringify(items));
};

const calculateTotals = (items: CartItem[]) => {
  return items.reduce(
    (acc, item) => {
      acc.totalAmount += item.price * item.count;
      acc.totalCount += item.count;
      return acc;
    },
    { totalAmount: 0, totalCount: 0 }
  );
};

const isAuthenticated = () => !!localStorage.getItem("auth_token");

// Sync local cart to server when user logs in
export const syncCartToServer = createAsyncThunk(
  "cart/syncToServer",
  async (_, { getState }) => {
    const state = getState() as { cart: CartState };
    const localItems = state.cart.items;

    // Push each local item to the server cart
    for (const item of localItems) {
      try {
        await addOrUpdateCartItem(item.id, item.count);
      } catch {
        // ignore individual item sync failures
      }
    }

    return localItems;
  }
);

// Add item to server cart (fire-and-forget for authenticated users)
export const addToCartServer = createAsyncThunk(
  "cart/addToServer",
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    await addOrUpdateCartItem(productId, quantity);
  }
);

// Remove item from server cart
export const removeFromCartServer = createAsyncThunk(
  "cart/removeFromServer",
  async (productId: number) => {
    await removeCartItem(productId);
  }
);

// Clear server cart
export const clearServerCartThunk = createAsyncThunk(
  "cart/clearServer",
  async () => {
    await clearServerCart();
  }
);

const initialCartItems = loadCartFromStorage();
const { totalAmount, totalCount } = calculateTotals(initialCartItems);

const initialState: CartState = {
  items: initialCartItems,
  totalAmount,
  totalCount,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.count += newItem.count || 1;
      } else {
        state.items.push({
          ...newItem,
          count: newItem.count || 1,
        });
      }

      const { totalAmount, totalCount } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalCount = totalCount;

      saveCartToStorage(state.items);

      // Sync to server if authenticated
      if (isAuthenticated()) {
        const item = state.items.find((i) => i.id === newItem.id);
        if (item) {
          addOrUpdateCartItem(item.id, item.count).catch(() => {});
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const { totalAmount, totalCount } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalCount = totalCount;

      saveCartToStorage(state.items);

      // Sync to server if authenticated
      if (isAuthenticated()) {
        removeCartItem(action.payload).catch(() => {});
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        item.count = quantity;
      }

      const { totalAmount, totalCount } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalCount = totalCount;

      saveCartToStorage(state.items);

      // Sync to server if authenticated
      if (isAuthenticated()) {
        addOrUpdateCartItem(id, quantity).catch(() => {});
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalCount = 0;
      localStorage.removeItem("basket");

      // Clear server cart if authenticated
      if (isAuthenticated()) {
        clearServerCart().catch(() => {});
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
