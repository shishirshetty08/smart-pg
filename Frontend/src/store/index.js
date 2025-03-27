import { configureStore } from "@reduxjs/toolkit";
import listingsReducer, { addListing, updateListing, deleteListing } from "../features/listings/ListingsSlice";
import authReducer, { login, logout, signup } from "./authSlice";

export const store = configureStore({
  reducer: {
    listings: listingsReducer,
    auth: authReducer,
  },
});

// Export actions for use in components
export { login, logout, signup, addListing, updateListing, deleteListing };