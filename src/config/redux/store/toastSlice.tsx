// src/features/toasts/toastSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ToastState {
  isVisible: boolean;
  message: string;

  type: "alert-info" | "alert-success" | "alert-warning" | "alert-error";
}

const initialState: ToastState = {
  isVisible: false,
  message: "",
  type: "alert-info",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: ToastState["type"] }>
    ) => {
      state.isVisible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideToast: (state) => {
      state.isVisible = false;
      state.message = "";
      state.type = "alert-info";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
