import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  userId: Cookies.get("vo__c") || null,
  auth: Cookies.get("auth") === "true" || false,
  role: Cookies.get("role") || null,
  status: Cookies.get("is_banned") || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
      state.error = null;
      if (action.payload) {
        Cookies.set("auth", action.payload, { 
          path: "/",
          secure: true,
          sameSite: "Lax"
        });
      }
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      if (action.payload) {
        Cookies.set("vo__c", action.payload, { 
          path: "/",
          secure: true,
          sameSite: "Lax"
        });
      }
    },
    setRole: (state, action) => {
      state.role = action.payload;
      if (action.payload) {
        Cookies.set("role", action.payload, { 
          path: "/",
          secure: true,
          sameSite: "Lax"
        });
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      if (action.payload) {
        Cookies.set("is_banned", action.payload, { 
          path: "/",
          secure: true,
          sameSite: "Lax"
        });
      }
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
    // Complete logout - clears everything
    logoutUser: (state) => {
      state.auth = false;
      state.role = null;
      state.status = null;
      state.userId = null;
      state.error = null;
      state.isLoading = false;

      // Clear all auth cookies
      Cookies.remove("auth", { path: "/" });
      Cookies.remove("role", { path: "/" });
      Cookies.remove("is_banned", { path: "/" });
      Cookies.remove("vo__c", { path: "/" });
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("access_token_expiry", { path: "/" });
    },
    // Reset error state
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuth,
  setRole,
  setStatus,
  logoutUser,
  setUserId,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
