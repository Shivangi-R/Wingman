import { useAppDispatch, useAppSelector } from "src/Redux/hooks";
import {
  selectEditStrokeType,
  selectEditStrokeSize,
  selectEditStrokeColor,
  setStrokeType,
  setStrokeColor,
  setStrokeSize,
  selectStrokes,
  drawUndo,
} from "src/Redux/imageEditor";
import { Listbox } from "@headlessui/react";
import { Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ReactComponent as PenToolIcon } from "src/Assets/img/pen.svg";
import { ReactComponent as EraseToolIcon } from "src/Assets/img/eraser.svg";



interface IDrawingTooltipProps {
  onCancel: () => void;
  onConfirm: (strokes) => void;
}
const DrawingTooltip = ({ onCancel, onConfirm }: IDrawingTooltipProps) => {
  const dispatch = useAppDispatch();
  const strokeType = useAppSelector(selectEditStrokeType);
  const strokeSize = useAppSelector(selectEditStrokeSize);
  const strokeColor = useAppSelector(selectEditStrokeColor);
  const strokes = useAppSelector(selectStrokes);

  return (
    <>
      <div className="drawing-tool-container">
        {/* First row*/}
        <div className="drawing-tool-row-1">
          {/* Pick size */}
          <div className="drawing-tool-size-picker">
            <input
              id="size-picker"
              type="range"
              min="1"
              max="100"
              value={strokeSize}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                dispatch(setStrokeSize(size));
              }}
              className="size-slider"
            ></input>
            <div className="size-preview">
              <SizePreview />
            </div>
          </div>
          {/* Cancel */}
          <button className="undo-btn" onClick={() => dispatch(drawUndo())}>
            Undo
          </button>
        </div>

        {/* Second row*/}
        <div className="drawing-tool-row-2">
          {/* Cancel drawing */}
          <Tooltip placement="top" title="Close">
            <button className="close-draw-btn" onClick={onCancel}>
              <CloseOutlined style={{ color: "white", fontSize: "18px" }} />
            </button>
          </Tooltip>
          {/* Pick color */}
          <Listbox
            as="div"
            className="color-listbox-container"
            value={strokeColor}
            onChange={(value: string) => dispatch(setStrokeColor(value))}
          >
            <Listbox.Button
              className="color-listbox-btn"
              style={{ backgroundColor: strokeColor }}
            ></Listbox.Button>
            <Listbox.Options className="color-listbox-options">
              {[
                "#2DD4BF",
                "#F87171",
                "#FB923C",
                "#A3E635",
                "#A78BFA",
                "#FFFFFF",
                "#000000",
              ].map((color) => (
                <Listbox.Option
                  key={color}
                  value={color}
                  className="color-listbox-item"
                  style={{ backgroundColor: color }}
                ></Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>

          {/* Set stroke type to draw */}
          <Tooltip placement="top" title="Pen">
            <button
              className="draw-btn"
              style={{ opacity: strokeType === "draw" ? 0.4 : 1 }}
              onClick={() => dispatch(setStrokeType("draw"))}
            >
              <PenToolIcon style={{ color: "white", height: "20px" }} />
            </button>
          </Tooltip>
          {/* Set stroke type to erase */}
          <Tooltip placement="top" title="Eraser">
            <button
              className="erase-btn"
              style={{ opacity: strokeType === "erase" ? 0.4 : 1 }}
              onClick={() => dispatch(setStrokeType("erase"))}
            >
              <EraseToolIcon style={{ color: "white", height: "20px" }} />
            </button>
          </Tooltip>
          {/* Confirm drawing */}
          <Tooltip placement="top" title="Confirm">
            <button
              className="confirm-draw-btn"
              onClick={() => onConfirm(strokes)}
            >
              <CheckOutlined style={{ color: "white", fontSize: "18px" }} />
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

const SizePreview = () => {
  const strokeSize = useAppSelector(selectEditStrokeSize);
  const strokeColor = useAppSelector(selectEditStrokeColor);
  const [hidden, setHidden] = useState<boolean>(true);

  useEffect(() => {
    setHidden(false);
    const interval = setInterval(() => {
      setHidden(true);
    }, 750);
    return () => clearInterval(interval);
  }, [strokeSize, strokeColor]);

  return (
    <div
      className="size-preview-circle"
      style={{
        transform: `scale(${hidden ? 0 : 1})`,
        backgroundColor: strokeColor,
        width: strokeSize,
        height: strokeSize,
        transformOrigin: "bottom center",
        transition: "transform 0.15s ease-out",
      }}
    ></div>
  );
};

export default DrawingTooltip;
