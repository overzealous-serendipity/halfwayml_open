import { ExtendedFile } from "@/types/extendedFile";
import { createSlice } from "@reduxjs/toolkit";
const fileSlice = createSlice({
  name: "file",
  initialState: null as ExtendedFile | null,
  reducers: {
    setFile: (state, action) => {
      return (state = action.payload);
    },
    removeFile: (state) => {
      return (state = null);
    },
  },
});

export const { setFile, removeFile } = fileSlice.actions;
export default fileSlice;
