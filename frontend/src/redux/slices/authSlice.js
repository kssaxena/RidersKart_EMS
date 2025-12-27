import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // admin / head data
  role: null, // "Admin" | "Head" | null
  isAuthenticated: false,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
    stopAuthLoading: (state) => {
      state.isAuthLoading = false;
    },
  },
});

export const { addUser, clearUser, stopAuthLoading } = authSlice.actions;
export default authSlice.reducer;
