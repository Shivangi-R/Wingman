import { createSlice } from "@reduxjs/toolkit";
import { AppStateType } from "./rootReducer";
import localStorageService from "src/Utils/localStorage";

interface initialStateInterface {
  editingCommentId: Number;
  editComment: boolean;
  editingComment: string;
  editingPostId: Number;
  commentUpdateReload: boolean;
}

const initialState: initialStateInterface = {
  editingCommentId: null,
  editComment: false,
  editingComment: null,
  editingPostId: null,
  commentUpdateReload: false,
};

const comment_modal = createSlice({
  name: "comment_modal",
  initialState,
  reducers: {
    setCurrentComment: (state, action) => {
      state.editingCommentId = action.payload.editingCommentId;
      state.editingComment = action.payload.editingComment;
      state.editingPostId = action.payload.editingPostId;
    },
    setEditComment: (state, action) => {
      state.editComment = action.payload;

      if (!action.payload) {
        state.editingCommentId = null;
        state.editingComment = null;
        state.editingPostId = null;
      }
    },
    setCommentUpdateReload:(state, action)=> {
      state.commentUpdateReload = action.payload;
    }
  },
});

export default comment_modal.reducer;
export const { setCurrentComment, setEditComment, setCommentUpdateReload } = comment_modal.actions;
