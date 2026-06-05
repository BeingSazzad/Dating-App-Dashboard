import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setMobileSidebar(state, action: { payload: boolean }) {
      state.mobileSidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setMobileSidebar } = uiSlice.actions;
export default uiSlice.reducer;
