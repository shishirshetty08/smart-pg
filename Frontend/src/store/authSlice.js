// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Currently logged-in user (email)
  isAuthenticated: false,
  users: [], // Array of registered users
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { email, password } = action.payload;
      const foundUser = state.users.find((u) => u.email === email && u.password === password);
      if (foundUser) {
        state.user = email;
        state.isAuthenticated = true;
        state.role = foundUser.role; // Store role in state
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
    },
    signup: (state, action) => {
      const { email, password, role } = action.payload;
      // Check if email already exists
      if (!state.users.some((u) => u.email === email)) {
        state.users.push({ email, password, role }); // Add new user
        state.user = email; // Auto-login after signup
        state.isAuthenticated = true;
        state.role = role;
      }
    },
  },
});

export const { login, logout, signup } = authSlice.actions;
export default authSlice.reducer;