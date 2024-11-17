import { useDrag, useGesture } from "@use-gesture/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/Redux/hooks";
import { clearCrop, selectCrop, setCropData } from "src/Redux/imageEditor";
import { CropInterface } from "src/Interfaces/CropInterface";

const MARGIN = 100;

interface Sides {
  left: boolean;
  top: boolean;
  right: boolean;
  bottom: boolean;
}

const CroppingComponent = ({ w, h }: { w: number; h: number; }) => {
  const dispatch = useAppDispatch();
  const crop = useAppSelector(selectCrop);
  const boxRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const topleftRef = useRef<HTMLDivElement>(null);
  const toprightRef = useRef<HTMLDivElement>(null);
  const bottomleftRef = useRef<HTMLDivElement>(null);
  const bottomrightRef = useRef<HTMLDivElement>(null);

  const width = crop.right - crop.left;
  const height = crop.bottom - crop.top;

  // Reset box on entering
  useEffect(() => {
    dispatch(clearCrop({ w: w, h: h }));
  }, []);

  const handleResize = useCallback(
    (down: boolean, mx: number, my: number, sides: Sides) => {
      if (!boxRef.current) return;
      if (!down) return;
      const { left, top, right, bottom } = crop;
      const { width, height } = boxRef.current.getBoundingClientRect();

      const scale = Math.min(w / width, h / height);
   
      const actualmx = mx * scale;
      const actualmy = my * scale;

      let newLeft = left + actualmx;
      let newRight = right + actualmx;
      let newTop = top + actualmy;
      let newBottom = bottom + actualmy;
      // Clip
      if (newLeft < 0) newLeft = 0;
      if (newLeft > crop.right - MARGIN) newLeft = crop.right - MARGIN;
      if (newRight > w) newRight = w;
      if (newRight < crop.left + MARGIN) newRight = crop.left + MARGIN;
      if (newTop < 0) newTop = 0;
      if (newTop > crop.bottom - MARGIN) newTop = crop.bottom - MARGIN;
      if (newBottom > h) newBottom = h;
      if (newBottom < crop.top + MARGIN) newBottom = crop.top + MARGIN;
   
      dispatch(
        setCropData({
          left: sides.left ? newLeft : left,
          top: sides.top ? newTop : top,
          right: sides.right ? newRight : right,
          bottom: sides.bottom ? newBottom : bottom,
        })
      );
    },
    [crop, dispatch, w, h]
  );

  // LEFT
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: true,
        top: false,
        right: false,
        bottom: false,
      });
    },
    { target: leftRef }
  );

  // RIGHT
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: false,
        top: false,
        right: true,
        bottom: false,
      });
    },
    { target: rightRef }
  );

  // TOP
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: false,
        top: true,
        right: false,
        bottom: false,
      });
    },
    { target: topRef }
  );

  // BOTTOM
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: false,
        top: false,
        right: false,
        bottom: true,
      });
    },
    { target: bottomRef }
  );

  // TOP-LEFT
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: true,
        top: true,
        right: false,
        bottom: false,
      });
    },
    { target: topleftRef }
  );

  // TOP-RIGHT
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: false,
        top: true,
        right: true,
        bottom: false,
      });
    },
    { target: toprightRef }
  );

  // BOTTOM-LEFT
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: true,
        top: false,
        right: false,
        bottom: true,
      });
    },
    { target: bottomleftRef }
  );

  // BOTTOM-RIGHT
  useDrag(
    ({ down, delta: [mx, my] }) => {
      handleResize(down, mx, my, {
        left: false,
        top: false,
        right: true,
        bottom: true,
      });
    },
    { target: bottomrightRef }
  );

  // WINDOW
  useDrag(
    ({ down, delta: [rawmx, rawmy] }) => {
      if (!boxRef.current) return;
      if (!down) return;
      const { left, top, right, bottom } = crop;
      const { width, height } = boxRef.current.getBoundingClientRect();
      const scale = Math.min(w / width, h / height);

      const mx = rawmx * scale;
      const my = rawmy * scale;

      const leftmx = left + mx > 0 ? mx : 0 - left;
      const topmy = top + my > 0 ? my : 0 - top;
      const rightmx = right + mx < w ? mx : w - right;
      const bottomy = bottom + my < h ? my : h - bottom;
      const actualmx =
        mx < 0 ? Math.max(leftmx, rightmx) : Math.min(leftmx, rightmx);
      const actualmy =
        my < 0 ? Math.max(topmy, bottomy) : Math.min(topmy, bottomy);
      const newCrop: CropInterface = {
        left: left + actualmx,
        top: top + actualmy,
        right: right + actualmx,
        bottom: bottom + actualmy,
      };
      dispatch(setCropData(newCrop));
    },
    {
      target: windowRef,
    }
  );

  return (
    <div ref={boxRef} className="cropping-container">
      <div
        style={{
          transform: `translate(${0}px, ${0}px)`,
          transformOrigin: "0 0",
          width: crop.left,
          height: h,
        }}
        className="backdrop"
      />
      <div
        style={{
          transform: `translate(${crop.left}px, ${0}px)`,
          transformOrigin: "0 0",
          width: width,
          height: crop.top,
        }}
        className="backdrop"
      />
      <div
        style={{
          transform: `translate(${crop.right}px, ${0}px)`,
          transformOrigin: "0 0",
          width: w - crop.right,
          height: h,
        }}
        className="backdrop"
      />
      <div
        style={{
          transform: `translate(${crop.left}px, ${crop.bottom}px)`,
          transformOrigin: "0 0",
          width: width,
          height: h - crop.bottom,
        }}
        className="backdrop"
      />
      <div
        className="inner-window-container"
        style={{
          transform: `translate(${crop.left}px, ${crop.top}px)`,
          width: width,
          height: height,
        }}
      >
        {/* INNER WINDOW */}
        <div
          ref={windowRef}
          className="inner-window"
          style={{ touchAction: "none" }}
        />
        {/* LEFT */}
        <div
          ref={leftRef}
          className="left"
          style={{ touchAction: "none" }}
        />
        {/* RIGHT */}
        <div
          ref={rightRef}
          className="right"
          style={{ touchAction: "none" }}
        />
        {/* TOP */}
        <div
          ref={topRef}
          className="top"
          style={{ touchAction: "none" }}
        />
        {/* BOTTOM */}
        <div
          ref={bottomRef}
          className="bottom"
          style={{ touchAction: "none" }}
        />
        {/* TOP-LEFT */}
        <div
          ref={topleftRef}
          className="top-left"
          style={{ touchAction: "none" }}
        />
        {/* TOP-RIGHT */}
        <div
          ref={toprightRef}
          className="top-right"
          style={{ touchAction: "none" }}
        />
        {/* BOTTOM-LEFT */}
        <div
          ref={bottomleftRef}
          className="bottom-left"
          style={{ touchAction: "none" }}
        />
        {/* BOTTOM-RIGHT */}
        <div
          ref={bottomrightRef}
          className="bottom-right"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
};

export default CroppingComponent;
