import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  isAdmin: boolean;
}

interface StoredAuth {
  token: string;
  user: AuthUser;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const loadAuthFromStorage = (): StoredAuth | null => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
};

const stored = loadAuthFromStorage();

const initialState: AuthState = {
  isAuthenticated: !!stored,
  user: stored?.user ?? null,
  token: stored?.token ?? null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;

      const stored: StoredAuth = {
        token: action.payload.token,
        user: action.payload.user,
      };
      localStorage.setItem("auth", JSON.stringify(stored));
      localStorage.setItem("auth_token", action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth");
      localStorage.removeItem("auth_token");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
