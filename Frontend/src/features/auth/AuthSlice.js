import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null, role: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
    });
  },
});

export default authSlice.reducer;