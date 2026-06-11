import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/services/api";
import authReducer from "@/store/slices/authSlice";
import uiReducer from "@/store/slices/uiSlice";

import { api as baseApi } from "@/redux/api/baseApi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware, baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
