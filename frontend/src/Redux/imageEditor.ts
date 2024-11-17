import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./rootReducer"

const initialState = {
  drawState: {
    strokes: [],
    stroke: {
      type: "draw",
      color: "#2DD4BF",
      size: 5,
    },
  },
  cropState: {
    data: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  },
};

export const imageEditor = createSlice({
  name: "imageEditor",
  initialState: initialState,
  reducers: {
    setStrokeType: (state, action) => {
      state.drawState.stroke.type = action.payload;
    },
    setStrokeSize: (state, action) => {
      state.drawState.stroke.size = action.payload;
    },
    setStrokeColor: (state, action) => {
      state.drawState.stroke.color = action.payload;
    },
    pushToLastStroke: (state, action) => {
      state.drawState.strokes[state.drawState.strokes.length - 1].points.push(action.payload);
    },
    newStroke: (state) => {
      state.drawState.strokes.push({
        points: [],
        data: {
          type: state.drawState.stroke.type,
          color: state.drawState.stroke.color,
          size: state.drawState.stroke.size,
        },
      });
    },
    clearStrokes: (state) => {
      state.drawState.strokes = [];
    },
    drawUndo: (state) => {
      state.drawState.strokes.pop();
    },
    clearCrop: (state, action) => {
      const { w, h } = action.payload;
      state.cropState.data = { left: 0, top: 0, right: w, bottom: h };
    },
    setCropData: (state, action) => {
      state.cropState.data = action.payload;
    }
  },
});

export const selectEditStrokeType = (state: RootState) => state.imageEditor.drawState.stroke.type;
export const selectEditStrokeSize = (state: RootState): number => state.imageEditor.drawState.stroke.size;
export const selectEditStrokeColor = (state: RootState): string => state.imageEditor.drawState.stroke.color;
export const selectStrokes = (state: RootState) => state.imageEditor.drawState.strokes.filter(stroke => stroke.points.length > 0);
export const selectCrop = (state: RootState) => state.imageEditor.cropState.data;


export const {
  setStrokeType,
  setStrokeSize,
  setStrokeColor,
  pushToLastStroke,
  newStroke,
  clearStrokes,
  drawUndo,
  clearCrop,
  setCropData
} = imageEditor.actions;

export default imageEditor.reducer;

