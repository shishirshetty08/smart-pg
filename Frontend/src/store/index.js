// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import listingsReducer, { addListing } from "../features/listings/ListingsSlice"; // Import addListing
import authReducer, { login, logout, signup } from "./authSlice";

export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    auth: authReducer,
  },
});

// Export actions for use in components
export { login, logout, signup, addListing };