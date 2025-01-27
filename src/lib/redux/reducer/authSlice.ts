import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;  // Change this to 'user' to match the initialState
  loader: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  user: null,  // Make sure this matches the interface
  loader: true,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExited: (state, action: PayloadAction<User>) => {
      state.user = action.payload;  // Use 'user' here
      state.loader = false;
    },
    userNotExited: (state) => {
      state.user = null;  // Use 'user' here
      state.loader = false;
    },
  },
});

export default authSlice;

export const { userExited, userNotExited } = authSlice.actions;
