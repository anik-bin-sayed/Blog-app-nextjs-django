import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  userId: Cookies.get("vo__c") || null,
  auth: Cookies.get("auth") === "true" || false,
  role: Cookies.get("role") || null,
  status: Cookies.get("is_banned") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
      Cookies.set("auth", action.payload, { path: "/" });
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
      Cookies.set("vo__c", action.payload, { path: "/" });
    },
    setRole: (state, action) => {
      state.role = action.payload;
      Cookies.set("role", action.payload, { path: "/" });
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      Cookies.set("is_banned", action.payload, { path: "/" });
    },
    logoutUser: (state) => {
      state.auth = false;
      state.role = null;
      state.status = null;
      state.userId = null;
      Cookies.remove("auth", { path: "/" });
      Cookies.remove("role", { path: "/" });
      Cookies.remove("is_banned", { path: "/" });
      Cookies.remove("vo__c", { path: "/" });
    },
  },
});

export const { setAuth, setRole, setStatus, logoutUser, setUserId } =
  authSlice.actions;
export default authSlice.reducer;
