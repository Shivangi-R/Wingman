import { createSlice } from "@reduxjs/toolkit";
import { AppStateType } from "./rootReducer";
import localStorageService from "src/Utils/localStorage";


interface postsListInterface{
  id: string;
  title: string;
  description: string;
  username: string;
  media: string[];
  ratings: number;
  userRating: number;
  comments?: any;
  tags: string[];
  saved: boolean;
  timestamp?: string;
  edited?: boolean;
  anonymousPostByCurrentUser?: boolean;
}
interface initialStateInterface {
  currentPost: {
    postId: Number;
    title: string;
    description: string;
    tags: string[];
    anonymous: boolean;
    anonymousPostByCurrentUser: boolean;
  };
  editingPost: boolean;
  postUpdatedRedirect: boolean;
  postsList: Array<postsListInterface>;
  showSearchFeed: boolean;
}

const initialState: initialStateInterface = {
  currentPost: null,
  editingPost: false,
  postUpdatedRedirect: false,
  postsList: [],
  showSearchFeed: false,
};



const post_modal = createSlice({
  name: "post_modal",
  initialState,
  reducers: {
    setCurrentPost: (state, action) => {
      state.currentPost = { ...action.payload };
    },
    setEditingPost: (state, action) => {
      state.editingPost = action.payload;

      if (!action.payload) {
        state.currentPost = null;
      }
    },
    setPostUpdatedRedirect: (state, action) => {
      state.postUpdatedRedirect = action.payload;
    },
    setPostsList: (state, action) => {
      state.postsList = action.payload;
    },
    setShowSearchFeed: (state, action) => {
      state.showSearchFeed = action.payload;
    }
  },
});

export default post_modal.reducer;
export const {
  setCurrentPost,
  setEditingPost,
  setPostUpdatedRedirect,
  setPostsList,
  setShowSearchFeed
} = post_modal.actions;
