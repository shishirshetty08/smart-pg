import { createSlice } from "@reduxjs/toolkit";

const listingsSlice = createSlice({
  name: "listings",
  initialState: { listings: [] },
  reducers: {
    addListing: (state, action) => {
      state.listings.push(action.payload);
    },
  },
});

export default listingsSlice;