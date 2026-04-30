import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
  role: null,
  status: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.auth = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;

      document.cookie = `role=${action.payload}; path=/`;
    },
    setStatus: (state, action) => {
      state.status = action.payload;

      document.cookie = `is_banned=${action.payload}; path=/`;
    },
    logoutUser: (state) => {
      state.auth = false;
      state.role = null;
      state.status = null;
      document.cookie = "role=; path=/; Max-Age=0";
      document.cookie = "is_banned=; path=/; Max-Age=0";
    },
  },
});

export const { setAuth, setRole, setStatus, logoutUser } = authSlice.actions;
export default authSlice.reducer;
