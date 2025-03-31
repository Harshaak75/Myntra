import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { backend_url } from "../../config";
// Replace with your actual backend URL

// ✅ Async function to check authentication status using Axios
export const checkAuthStatus = createAsyncThunk(
  "auth/checkStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backend_url}seller/auth/check`, {
        withCredentials: true, // ✅ Ensure cookies are sent
      });
      return response.data; // Assuming backend returns `{ user, isAuthenticated }`
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Authentication failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true, // 🔹 Ensure loading starts as true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user; // Ensure backend returns `user`
        state.isAuthenticated = true;
        state.loading = false; // ✅ Ensure loading becomes false
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false; // ✅ Prevent infinite loading
      });
  },
});

export default authSlice.reducer;
