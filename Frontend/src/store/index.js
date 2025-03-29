import { configureStore, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/listings";
const AUTH_API_URL = "http://localhost:5000/api/auth";

const listingsSlice = createSlice({
  name: "listings",
  initialState: { listings: [] },
  reducers: {
    setListings(state, action) {
      state.listings = action.payload;
    },
    addListing(state, action) {
      state.listings.push(action.payload);
    },
    removeListing(state, action) {
      state.listings = state.listings.filter((listing) => listing._id !== action.payload);
    },
    modifyListing(state, action) {
      const index = state.listings.findIndex((listing) => listing._id === action.payload._id);
      if (index !== -1) {
        state.listings[index] = action.payload;
      }
    },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    token: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    signupSuccess(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, signupSuccess, logout, setError } = authSlice.actions;
export const { setListings, addListing, removeListing, modifyListing } = listingsSlice.actions;

export const signup = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/signup`, credentials);
    const { user, role, token } = response.data;
    dispatch(signupSuccess({ user, role, token }));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Signup failed.";
    dispatch(setError(errorMessage));
    throw error;
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, credentials);
    const { user, role, token } = response.data;
    dispatch(loginSuccess({ user, role, token }));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed.";
    dispatch(setError(errorMessage));
    throw error;
  }
};

export const createListing = (listingData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const response = await axios.post(API_URL, listingData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    dispatch(addListing(response.data));
    return response.data;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

export const fetchListings = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("No authentication token found");
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(setListings(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Error fetching listings";
    console.error(errorMessage, error);
    throw error;
  }
};

export const updateListing = ({ id, updatedListing }) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    const response = await axios.put(`${API_URL}/${id}`, updatedListing, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(modifyListing(response.data));
    return response.data;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

export const deleteListing = (id) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(removeListing(id));
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

export const store = configureStore({
  reducer: {
    listings: listingsSlice.reducer,
    auth: authSlice.reducer,
  },
});

export default store;