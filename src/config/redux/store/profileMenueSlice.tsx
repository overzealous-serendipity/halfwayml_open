// store/profileMenuSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMenuOpen: false,
};

export const profileMenuSlice = createSlice({
  name: "profileMenue",
  initialState,
  reducers: {
    toggleProfileMenu: (state) => {
      state.isMenuOpen = !state.isMenuOpen;
    },
    closeProfileMenu: (state) => {
      state.isMenuOpen = false;
    },
  },
});

export const { toggleProfileMenu, closeProfileMenu } = profileMenuSlice.actions;

export default profileMenuSlice;
