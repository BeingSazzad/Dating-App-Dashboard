import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AdminUser, AuthState } from "@/types";

const STORAGE_KEY = "rated.auth";

function load(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthState;
  } catch {
    /* ignore */
  }
  return { user: null, token: null };
}

const initialState: AuthState = load();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AdminUser; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    },
    updateProfile(state, action: PayloadAction<Partial<AdminUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { setCredentials, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;
