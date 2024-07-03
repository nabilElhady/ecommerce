// store.js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import listReducers from "./listSlice";
import paymentReducer from "./paymentSlice";
const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    list: listReducers,
    payment: paymentReducer,
  },
});

export default store;
