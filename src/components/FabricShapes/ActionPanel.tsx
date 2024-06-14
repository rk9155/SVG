import React from "react";
import * as fabric from "fabric";
import { calloutPoints } from "../../utils/calloutPoints";
import GroupWithPolygon from "../../utils/fabricPolygon";
import { Button, Typography } from "antd";

interface IProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas>;
}
const ActionPanel: React.FC<IProps> = (props) => {
  const { fabricCanvas } = props;
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

  const handleAddText = (type: string) => {
    const points = calloutPoints(type);
    if (points.points.length === 0) return;
    const polygon = new GroupWithPolygon(
      points?.points,
      {
        left: 100,
        top: 50,
        fill: "#D81B60",
        scaleX: 1,
        scaleY: 1,
        lockRotation: true,
        objectCaching: false,
        transparentCorners: false,
        cornerColor: "blue",
      },
      fabricCanvas.current,
      points?.pointIndex,
      points.widthPointer,
      points.heightPointer,
      points.type
    );
    fabricCanvas.current.clear();
    fabricCanvas.current.add(polygon);
    fabricCanvas.current.renderAll();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        height: "70%",
        gap: "20px",
        borderLeft: "2px solid #d9d9d9",
      }}
    >
      <Typography.Title level={5}>Shapes</Typography.Title>
      <Button onClick={handleAddRectangle}>Rectangle</Button>
      <Button onClick={() => handleAddText("bottom")}>Callout bottom</Button>
      <Button onClick={() => handleAddText("top")}>Callout top</Button>
      <Button onClick={() => handleAddText("left")}>Callout left</Button>
      <Button onClick={() => handleAddText("right")}>Callout right</Button>
    </div>
  );
};

export default ActionPanel;
