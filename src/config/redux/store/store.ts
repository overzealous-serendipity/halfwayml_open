import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalSlice";
import toastReducer from "./toastSlice";
import fileSlice from "./fileSlice";
import profileMenueSlice from "./profileMenueSlice";

export interface ModalState {
  modalType: string | null;
  modalProps: {
    transcriptionRecord?: any;
    [key: string]: any;
  };
}

export interface RootState {
  modal: ModalState;
  toast: any;
  file: any;
  profileMenue: {
    isMenuOpen: boolean;
  };
}

const store = configureStore({
  reducer: {
    modal: modalReducer,
    toast: toastReducer,
    file: fileSlice.reducer,
    profileMenue: profileMenueSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
