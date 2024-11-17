import { createSlice } from "@reduxjs/toolkit";
import { AppStateType } from "./rootReducer";
import localStorageService from "src/Utils/localStorage";

interface initialStateInterface {
  username?: string;
  email?: string;
  isLoggedIn: boolean;
  loading: boolean;
  token: string;
  showVerificationPage: boolean;
  verified: boolean;
}

const initialState: initialStateInterface = {
  username: null,
  email:null,
  isLoggedIn: false,
  loading: false,
  token: undefined,
  showVerificationPage: false,
  verified: false,
};

const auth_modal = createSlice({
  name: "auth_modal",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorageService.set("token", state.token);
      state.isLoggedIn = true;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },

    setLogout: (state) => {
      localStorageService.removeAll();
      state.token = undefined;
      state.username = null;
      state.email = null;
      state.isLoggedIn = false;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShowVerificationPage: (state, action) => {
      state.showVerificationPage = action.payload;
    },
    setVerified: (state) => {
      state.verified = true;
    }
  },
});

export default auth_modal.reducer;
export const {
  setIsLoggedIn,
  setLoading,
  setLogout,
  setToken,
  setCurrentUser,
  setShowVerificationPage,
  setVerified,
} = auth_modal.actions;

