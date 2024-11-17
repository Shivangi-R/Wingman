import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "src/Redux/hooks";
import {
  drawUndo,
  newStroke,
  pushToLastStroke,
  selectStrokes,
} from "src/Redux/imageEditor";

const DrawingCanvas = ({ w, h }: { w: number; h: number }) => {
  const { handleStroke, handleStrokeStart, handleStrokeEnd, handleUndo } =
    useStrokeHandler();
  const strokes = useAppSelector(selectStrokes);
  const canvas = useRef<HTMLCanvasElement>(null);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      handleStrokeStart();
    },
    [handleStrokeStart]
  );

  const handlePointMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!canvas.current) return;
      const box = canvas.current.getBoundingClientRect();
      const canvas_size = { w: canvas.current.width, h: canvas.current.height };
      handleStroke(event, box, canvas_size);
    },
    [handleStroke, canvas.current]
  );

  const handlePointerUp = useCallback(handleStrokeEnd, [handleStrokeEnd]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "z" && event.ctrlKey) {
        handleUndo();
      }
    },
    [handleUndo]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
        renderStrokes(ctx, strokes);
      }
    }
  }, [strokes]);

  return (
    <>
      <canvas
        ref={canvas}
        width={w}
        height={h}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerMove={handlePointMove}
        className="drawing-container"
        id="canvas"
      ></canvas>
    </>
  );
};

export default DrawingCanvas;

/*

Utils to draw

*/

export const renderStrokes = (ctx: CanvasRenderingContext2D, strokes) => {
  strokes.forEach((stroke) => {
    if (stroke.data.type === "draw") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = stroke.data.color;
    }
    if (stroke.data.type === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "#000000";
    }
    ctx.lineWidth = stroke.data.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    stroke.points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();
  });
};

const useStrokeHandler = () => {
  const dispatch = useAppDispatch();

  const [pointerDown, setPointerDown] = useState<boolean>(false);

  const handleStroke = (
    event: React.PointerEvent<HTMLCanvasElement>,
    box: DOMRect,
    canvas_size: { w: number; h: number }
  ) => {
    if (pointerDown) {
      const { w, h } = canvas_size;
      const { top, left, width, height } = box;

      const point = {
        x: ((event.clientX - left) / width) * w,
        y: ((event.clientY - top) / height) * h,
      };
      dispatch(pushToLastStroke(point));
    }
  };

  const handleStrokeStart = () => {
    dispatch(newStroke());
    setPointerDown(true);
  };

  const handleStrokeEnd = () => {
    setPointerDown(false);
  };

  const handleUndo = () => {
    dispatch(drawUndo());
  };

  return {
    handleStroke,
    handleStrokeStart,
    handleStrokeEnd,
    handleUndo,
  };
};
