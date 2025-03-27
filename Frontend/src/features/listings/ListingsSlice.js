import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listings: [
    {
      _id: "1",
      title: "Cozy PG in Mumbai",
      location: "Mumbai",
      rent: 8000,
      facilities: ["WiFi", "Food"],
      type: "pg",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "2",
      title: "Shared Room in Delhi",
      location: "Delhi",
      rent: 5000,
      facilities: ["AC"],
      type: "room",
      image: "https://images.unsplash.com/photo-1578683015128-52085e87ad47?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "3",
      title: "Entire House in Bangalore",
      location: "Bangalore",
      rent: 15000,
      facilities: ["Parking", "WiFi"],
      type: "entireHouse",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "4",
      title: "Roommate Space in Pune",
      location: "Pune",
      rent: 6000,
      facilities: ["Food"],
      type: "roommate",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "5",
      title: "CoLiving in Chennai",
      location: "Chennai",
      rent: 7000,
      facilities: ["WiFi", "AC"],
      type: "coliving",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "6",
      title: "Flatmate in Hyderabad",
      location: "Hyderabad",
      rent: 6500,
      facilities: ["Parking"],
      type: "flatmate",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ],
};

const listingsSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {
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

export const { addListing, updateListing, deleteListing } = listingsSlice.actions;
export default listingsSlice.reducer;