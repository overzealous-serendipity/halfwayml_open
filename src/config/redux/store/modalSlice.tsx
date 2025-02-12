// store/modalSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalState } from "./store";

const initialState: ModalState = {
  modalType: null,
  modalProps: {},
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ modalType: string; modalProps?: any }>
    ) => {
      state.modalType = action.payload.modalType;
      state.modalProps = action.payload.modalProps || {};
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalProps = {};
    },
    updateModalProps: (state, action: PayloadAction<any>) => {
      state.modalProps = { ...state.modalProps, ...action.payload };
    },
  },
});

export const { openModal, closeModal, updateModalProps } = modalSlice.actions;

export default modalSlice.reducer;
