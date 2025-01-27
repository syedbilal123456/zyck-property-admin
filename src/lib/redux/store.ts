import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducer/authSlice";
import dateSlice from "./reducer/dateSlice"

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [dateSlice.name]:dateSlice.reducer
  },
});

// Define RootState type
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;