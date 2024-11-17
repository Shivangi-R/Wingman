import { combineReducers, configureStore } from "@reduxjs/toolkit";


import imageEditor from "./imageEditor";
import authModal from "./auth";
import commentModal from "./commentModal";
import postModal from "./postModal";



const reducer = combineReducers({
  imageEditor,
  authModal,
  commentModal,
  postModal
});

// reset state on logout
const rootReducer = (state, action) => {
  return reducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStateType = ReturnType<typeof reducer>;
export interface SerializedError {
  name?: string;
  message?: string;
  code?: string;
  stack?: string;
}

export default store;
