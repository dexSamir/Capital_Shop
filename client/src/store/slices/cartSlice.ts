import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

      localStorage.setItem("basket", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      const { totalAmount, totalCount } = calculateTotals(state.items);
      state.totalAmount = totalAmount;
      state.totalCount = totalCount;

      localStorage.setItem("basket", JSON.stringify(state.items));
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

      localStorage.setItem("basket", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalCount = 0;
      localStorage.removeItem("basket");
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
