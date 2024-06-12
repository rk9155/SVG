/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import GroupWithPolygon from "../../utils/fabricPolygon";

const FabricEditor = () => {
  const fabricCanvas =
    useRef<fabric.Canvas>() as React.MutableRefObject<fabric.Canvas>;

  useEffect(() => {
    const canvasDiv = document.getElementById(
      "canvas-div"
    ) as HTMLCanvasElement;
    if (canvasDiv) {
      fabricCanvas.current = new fabric.Canvas(canvasDiv, {
        width: 800,
        height: 800,
      });
    }

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
      }
    };
  }, []);

  const handleAddRectangle = () => {
    const rect = new fabric.Rect({
      width: 200,
      height: 100,
      strokeWidth: 4,
      fill: "#d9d9d9",
      stroke: "#000",
      lockRotation: true,
      objectCaching: true,
      noScaleCache: true,
      strokeUniform: true,
      transparentCorners: false,
      cornerColor: "#000",
      cornerStyle: "circle",
      cornerSize: 8,
      cornerStrokeColor: "#1d7bb9",
    });

    fabricCanvas.current.add(rect);
    fabricCanvas.current.renderAll();
  };

  const handleAddText = () => {
    // const rectWithText = new GroupWithText({
    //     width: 200,
    //     height: 100,
    //     strokeWidth: 4,
    //     fill: '#000',
    //     stroke: '#000',
    //     lockRotation: true,
    // 	objectCaching: true,
    // 	noScaleCache: true,
    // 	strokeUniform: true,
    // 	transparentCorners: false,
    // 	cornerColor: '#000',
    // 	cornerStyle: 'circle',
    // 	cornerSize: 8,
    // 	cornerStrokeColor: '#1d7bb9',
    // })
    // fabricCanvas.current.add(rectWithText);

    const points = [
      {
        x: 0,
        y: 0,
      },
      {
        x: 200,
        y: 0,
      },
      {
        x: 200,
        y: 100,
      },
      {
        x: 100,
        y: 100,
      },
      {
        x: 120,
        y: 200,
      },
      {
        x: 150,
        y: 100,
      },
      {
        x: 0,
        y: 100,
      },
    ];
    const polygon = new GroupWithPolygon(
      points,
      {
        left: 0,
        top: 0,
        fill: "#D81B60",
        scaleX: 1,
        scaleY: 1,
        lockRotation: true,
        objectCaching: false,
        transparentCorners: false,
        cornerColor: "blue",
      },
      fabricCanvas.current
    );
    fabricCanvas.current.add(polygon);
    fabricCanvas.current.renderAll();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <div>FabricEditor</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "800px",
          padding: "10px",
          gap: "20px",
        }}
      >
        <button onClick={handleAddRectangle}>Rectangle</button>
        <button onClick={handleAddText}>Text</button>
      </div>
      <canvas id="canvas-div" />
    </div>
  );
};

export default FabricEditor;
