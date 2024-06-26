import React from "react";
import * as fabric from "fabric";
import { calloutPoints } from "../../utils/calloutPoints";
import GroupWithPolygon from "../../utils/fabricPolygon";
import { Button, Radio, RadioChangeEvent, Space, Typography } from "antd";
import { animation } from "../../utils/animation";

interface IProps {
  fabricCanvas: React.MutableRefObject<fabric.Canvas>;
}
const ActionPanel: React.FC<IProps> = (props) => {
  const { fabricCanvas } = props;

  const handleSaveImage = () => {
    if (fabricCanvas.current) {
      fabricCanvas.current.renderAll();
      const dataURL = fabricCanvas.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-image.png";
      link.click();
    }
  };

  const handleChangeAnimation = (e: RadioChangeEvent) => {
    animation(e.target.value, fabricCanvas);
  };

  const handleAddRectangle = () => {
    const rect = new fabric.Rect({
      width: 200,
      height: 100,
      left: 200,
      top: 100,
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

      <Radio.Group onChange={handleChangeAnimation}>
        <Space direction="vertical">
          <Radio.Button value={"fade"}>Fade</Radio.Button>
          <Radio.Button value={"float"}>Float</Radio.Button>
          <Radio.Button value={"zoom-in"}>Zoom In</Radio.Button>
          <Radio.Button value={"drop"}>Drop</Radio.Button>
          <Radio.Button value={"pop"}>Pop</Radio.Button>
          <Radio.Button value={"bounce"}>Bounce</Radio.Button>
          <Radio.Button value={"spin"}>Spin</Radio.Button>
          <Radio.Button value={"slide-bounce"}>Slide Bounce</Radio.Button>
          <Radio.Button value={"gentle-float"}>Gental Float</Radio.Button>
        </Space>
      </Radio.Group>
      <Button onClick={handleSaveImage}>Save Image</Button>
    </div>
  );
};

export default ActionPanel;
