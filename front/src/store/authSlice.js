import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: null,
  change: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user; // Change 'users' to 'user'
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.user = null;
      state.token = null;
    },
    setchange: (state) => {
      state.change = !state.change;
    },
  },
});

export const { setLogin, logout, setchange } = authSlice.actions;
export default authSlice.reducer;
