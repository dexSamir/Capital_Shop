import { configureStore, type Middleware } from "@reduxjs/toolkit";
import {
  addOrUpdateCartItem,
  removeCartItem,
  clearServerCart,
} from "../api/cart";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice.ts";
import wishlistReducer from "./slices/wishlistSlice";
import productReducer from "./slices/productSlice";

const isAuthenticated = () => !!localStorage.getItem("auth_token");

const cartSyncMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);
  const act = action as { type: string; payload?: unknown };

  if (!isAuthenticated()) return result;

  if (act.type === "cart/addToCart") {
    const state = store.getState() as RootState;
    const payload = act.payload as { id: number };
    const item = state.cart.items.find((i: { id: number; count: number }) => i.id === payload.id);
    if (item) {
      addOrUpdateCartItem(item.id, item.count).catch(() => {});
    }
  } else if (act.type === "cart/removeFromCart") {
    removeCartItem(act.payload as number).catch(() => {});
  } else if (act.type === "cart/updateCartItemQuantity") {
    const { id, quantity } = act.payload as { id: number; quantity: number };
    addOrUpdateCartItem(id, quantity).catch(() => {});
  } else if (act.type === "cart/clearCart") {
    clearServerCart().catch(() => {});
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
