import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  listings: [],
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    addListing: (state, action) => {
      state.listings.push(action.payload);
    },
    updateListing: (state, action) => {
      const { id, updatedListing } = action.payload;
      const index = state.listings.findIndex((listing) => listing._id === id);
      if (index !== -1) {
        state.listings[index] = { ...state.listings[index], ...updatedListing };
      }
    },
    deleteListing: (state, action) => {
      state.listings = state.listings.filter((listing) => listing._id !== action.payload);
    },
  },
});

export const { setListings, addListing, updateListing, deleteListing } = listingsSlice.actions;

// Thunks for API calls
export const fetchListings = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:5000/api/listings");
    dispatch(setListings(response.data));
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
};

export const createListing = (listingData) => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:5000/api/listings", listingData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(addListing(response.data));
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const updateListingThunk = (id, updatedListing) => async (dispatch) => {
  try {
    const response = await axios.put(`http://localhost:5000/api/listings/${id}`, updatedListing, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateListing({ id, updatedListing: response.data }));
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListingThunk = (id) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/api/listings/${id}`);
    dispatch(deleteListing(id));
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

export default listingsSlice.reducer;