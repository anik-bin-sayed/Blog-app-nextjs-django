import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: false,
  role: null,
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
    logout: (state) => {
      state.auth = false;
      state.role = null;
      document.cookie = "role=; path=/";
    },
  },
});

export const { setAuth, setRole, logout } = authSlice.actions;
export default authSlice.reducer;
