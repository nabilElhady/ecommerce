import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async (amount) => {
    const response = await axios.post(
      "http://localhost:8000/create-payment-intent",
      { amount }
    );
    return response.data.clientSecret;
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    clientSecret: "",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default paymentSlice.reducer;
