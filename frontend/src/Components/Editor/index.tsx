import React, { useRef, useState, useCallback, useEffect } from "react";
import { useDrag, useGesture } from "@use-gesture/react";
import DrawingComponent, { renderStrokes } from "./DrawingCanvas";
import DrawingTooltip from "./DrawingTool";
import CroppingComponent from "./CroppingComponent";
import CroppingTooltip from "./CroppingTool";
import { useAppDispatch } from "src/Redux/hooks";
import { clearCrop, clearStrokes, selectStrokes } from "src/Redux/imageEditor";
import DrawingCanvas from "./DrawingCanvas";
import { Tooltip } from "antd";
import { ReactComponent as MoveToolIcon } from "src/Assets/img/move.svg";
import { ReactComponent as DrawToolIcon } from "src/Assets/img/draw.svg";
import { ReactComponent as CropToolIcon } from "src/Assets/img/crop.svg";



const ToolButton = ({
  tool,
  selected,
  setSelected,
  setSelectedModal,
  children,
}: {
  tool;
  selected;
  setSelected: (tool) => void;
  setSelectedModal: any;
  children: React.ReactNode;
}) => {
  const toolTipTitle = tool.charAt(0).toUpperCase() + tool.slice(1); //capitalize
  return (
    <Tooltip placement="top" title={toolTipTitle}>
      <button
        className="editing-tool-btns"
        style={{ opacity: selected === tool ? 0.4 : 1 }}
        onClick={() => {
          setSelected(tool);
          setSelectedModal(tool);
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
};

const clamp = (x: number, min: number, max: number) =>
  Math.max(Math.min(x, max), min);

interface IScreenEditorProps {
  uri: string;
  editScreen: (file: { file: File; uri: string }, index: number) => void;
  index: number;
  setIsModalVisible: any;
  setSelectedTool: any;
  fileProp: any;
}

const ImageEditor = ({
  uri,
  editScreen,
  index,
  setIsModalVisible,
  setSelectedTool,
  fileProp,
}: IScreenEditorProps) => {
  const dispatch = useAppDispatch();
  const [tool, setTool] = useState("move");

  // Data about new screen
  const [tmpScreen, setTmpScreen] = useState({
    uri: uri,
    file: null,
  });

  useEffect(() => {
    setTmpScreen({
      uri: uri,
      file: null,
    });
  }, [uri]);

  // Data about transformation (zoom, translation)
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Refs
  const canvas = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);

  // Drawing callbacks
  const onCancelDraw = useCallback(() => {
    dispatch(clearStrokes());
    setTool("move");
    setSelectedTool(tool);
  }, [setTool]);

  const onConfirmDraw = useCallback(
    (strokes) => {
      if (!image.current) return;
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d")!;
      const height = image.current.height;
      const width = image.current.width;

      cvs.width = width;
      cvs.height = height;
      renderStrokes(ctx, strokes);
      ctx.globalCompositeOperation = "destination-over";
      ctx.drawImage(image.current, 0, 0, width, height);

      cvs.toBlob(async (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const file = new File([blob], fileProp["name"], {
          type: fileProp["type"],
        });

        setTmpScreen({ uri: url, file: file });
        setTool("move");
        setSelectedTool(tool);
        dispatch(clearStrokes());
      }, "image/jpeg");
    },
    [setTool]
  );

  // Cropping callbacks
  const onCancelCrop = useCallback(() => {
    if (!image.current) return;
    dispatch(
      clearCrop({
        w: image.current.width,
        h: image.current.height,
      })
    );
    setTool("move");
    setSelectedTool(tool);
  }, [setTool]);

  const onConfirmCrop = useCallback(
    (crop) => {
      if (!image.current) return;
      const cvs = document.createElement("canvas");
      const ctx = cvs.getContext("2d")!;
      const width = crop.right - crop.left;
      const height = crop.bottom - crop.top;

      cvs.width = width;
      cvs.height = height;
      ctx.drawImage(
        image.current,
        crop.left,
        crop.top,
        width,
        height,
        0,
        0,
        width,
        height
      );

      cvs.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const file = new File([blob], fileProp["name"], {
          type: fileProp["type"],
        });
        setTmpScreen({ uri: url, file: file });
        setTool("move");
        setSelectedTool(tool);
        dispatch(clearStrokes());
      }, "image/jpeg");
    },
    [setTool]
  );

  // Global edit function
  const validateEdit = useCallback(() => {
    if (tmpScreen.uri === uri || tmpScreen.file === null) return;
    editScreen(tmpScreen, index);
  }, [tmpScreen, uri, editScreen, index]);

  // useGesture setup
  useGesture(
    {
      onDrag: ({ delta: [dx, dy] }) => {
        if (tool === "move") {
          setPosition({
            x: position.x + dx,
            y: position.y + dy,
          });
        }
      },
      onPinch: ({ memo, da: [d, a], origin: [x, y] }) => {
        memo ??= {
          distance: d,
        };
        const dz = d - memo.distance;
        if (canvas.current && container.current) {
          const dzoom = dz * 0.005;
          const newzoom = clamp(zoom + dzoom, 0.5, 4);
          const actual_dzoom = newzoom - zoom;
          const canvasBounds = canvas.current.getBoundingClientRect();
          const containerBounds = container.current.getBoundingClientRect();
          const dx = ((x - canvasBounds.x) * actual_dzoom) / zoom;
          const dy = ((y - canvasBounds.y) * actual_dzoom) / zoom;
          setPosition({
            x: position.x - dx,
            y: position.y - dy,
          });
          setZoom(newzoom);
        }
        return {
          distance: d,
        };
      },

      onWheel: ({ event, delta: [_, dz] }) => {
        if (canvas.current && container.current) {
          const dzoom = -dz * 0.001;
          const newzoom = clamp(zoom + dzoom, 0.5, 4);
          const actual_dzoom = newzoom - zoom;
          const canvasBounds = canvas.current.getBoundingClientRect();
          const containerBounds = container.current.getBoundingClientRect();
          const dx = ((event.clientX - canvasBounds.x) * actual_dzoom) / zoom;
          const dy = ((event.clientY - canvasBounds.y) * actual_dzoom) / zoom;
          setPosition({
            x: position.x - dx,
            y: position.y - dy,
          });
          setZoom(newzoom);
        }
      },
    },
    {
      target: container,
    }
  );

  return (
    <>
      {/* CANVAS */}
      <div
        ref={container}
        className="canvas-container"
        onClick={(e) => e.stopPropagation()}
        // style={{ touchAction: "none", border:"2px solid black", overflow:"hidden" }}
      >
        <div
          ref={canvas}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            touchAction: "none",
            transformOrigin: "0 0",
            position: "relative",
          }}
        >
          {image.current && tool === "draw" && (
            <DrawingCanvas w={image.current.width} h={image.current.height} />
          )}
          {image.current && tool === "crop" && (
            <CroppingComponent
              w={image.current.width}
              h={image.current.height}
            />
          )}
          <img
            className="edit-image"
            src={tmpScreen.uri}
            ref={image}
            alt="editable-img"
            style={{ width: "100%" }}
            draggable={false}
          />
        </div>
      </div>

      {/* TOOLTIP */}
      <div className="tooltip-container">
        {tool === "move" ? (
          <>
            <Tooltip placement="top" title="Crop">
              <ToolButton
                tool="crop"
                selected={tool}
                setSelected={setTool}
                setSelectedModal={setSelectedTool}
              >
                <CropToolIcon style={{ margin: "auto", color: "white" }} />
              </ToolButton>
            </Tooltip>
            <Tooltip placement="top" title="Draw">
              <ToolButton
                tool="draw"
                selected={tool}
                setSelected={setTool}
                setSelectedModal={setSelectedTool}
              >
                <DrawToolIcon style={{ margin: "auto", color: "white" }} />
              </ToolButton>
            </Tooltip>
            <Tooltip placement="top" title="Move">
              <ToolButton
                tool="move"
                selected={tool}
                setSelected={setTool}
                setSelectedModal={setSelectedTool}
              >
                <MoveToolIcon style={{ margin: "auto", color: "white" }} />
              </ToolButton>
            </Tooltip>
          </>
        ) : tool === "draw" ? (
          <DrawingTooltip onCancel={onCancelDraw} onConfirm={onConfirmDraw} />
        ) : tool === "crop" ? (
          <CroppingTooltip onCancel={onCancelCrop} onConfirm={onConfirmCrop} />
        ) : null}
      </div>

      {/* Save / Cancel */}
      {tool === "move" && (
        <div className="edit-btn-container">
          <button
            className="edit-close-btn"
            onClick={() => {
              setIsModalVisible(false);
              onCancelCrop();
              onCancelDraw();
            }}
          >
            <div> Close </div>
          </button>
          <button
            className="edit-confirm-btn"
            onClick={() => {
              validateEdit();
              setIsModalVisible(false);
            }}
          >
            <div> Confirm </div>
          </button>
        </div>
      )}
    </>
  );
};

export default ImageEditor;
