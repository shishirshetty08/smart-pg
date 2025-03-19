// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/AuthSlice";
import listingsSlice from "../features/listings/ListingsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    listings: listingsSlice.reducer,
  },
});

export const { signup, login, logout } = authSlice.actions;
export const { addListing } = listingsSlice.actions;