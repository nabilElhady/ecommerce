import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    filteredList: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { filteredList } = listSlice.actions;
export default listSlice.reducer;
