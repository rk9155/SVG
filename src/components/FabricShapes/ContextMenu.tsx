import React from "react";
import {
  Button,
  ColorPicker,
  InputNumber,
  InputNumberProps,
  Tooltip,
} from "antd";
import * as fabric from "fabric";
import { Color } from "antd/es/color-picker";
import {
  BgColorsOutlined,
  BoldOutlined,
  FontColorsOutlined,
  ItalicOutlined,
} from "@ant-design/icons";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onDelete: () => void;
  fabricCanvas: React.MutableRefObject<fabric.Canvas>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  fabricCanvas,
}) => {
  if (!visible) return null;

  const handleBackgroundColorChange = (__: Color, val: string) => {
    const currentObject = fabricCanvas.current.getObjects();
    if (currentObject) {
      currentObject[0].set({ fill: val });
      fabricCanvas.current.renderAll();
    }
  };

  const handleFontColorChange = (__: Color, val: string) => {
    const currentObject = fabricCanvas.current.getObjects();
    if (currentObject[1]) {
      currentObject[1].set({ fill: val });
      fabricCanvas.current.renderAll();
    }
  };

  const handleBorderColorChange = (__: Color, val: string) => {
    const currentObject = fabricCanvas.current.getObjects();
    if (currentObject) {
      currentObject[0].set({ stroke: val });
      fabricCanvas.current.renderAll();
    }
  };

  const handleFontSizeChange: InputNumberProps["onChange"] = (value) => {
    const currentObject = fabricCanvas.current.getObjects();
    if (currentObject[1]) {
      currentObject[1].set({ fontSize: value });
      fabricCanvas.current.renderAll();
    }
  };

  const handleFontTypeChange = () => {
    const currentObject =
      fabricCanvas.current.getObjects()[1] as fabric.Textbox;
    if (currentObject) {
      currentObject.set({
        fontWeight: currentObject.fontWeight === "bold" ? "normal" : "bold",
      });
      fabricCanvas.current.renderAll();
    }
  };

  const handleFontStyleChange = () => {
    const currentObject =
      fabricCanvas.current.getObjects()[1] as fabric.Textbox;
    if (currentObject) {
      currentObject.set({
        fontWeight: currentObject.fontStyle === "normal" ? "italic" : "normal",
      });
      fabricCanvas.current.renderAll();
    }
  };

  return (
    <div
      style={{
        top: y,
        left: x,
        display: "block",
        position: "absolute",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          borderRadius: "5px",
          border: "1px solid #f6f6f6",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "5px",
          gap: "8px",
          background: "#fff",
        }}
      >
        <Tooltip title="Background Color">
          <ColorPicker
            onChange={handleBackgroundColorChange}
            size="middle"
            defaultValue={"#fff"}
            placement="bottomLeft"
          >
            <Button size="small" icon={<BgColorsOutlined />} />
          </ColorPicker>
        </Tooltip>
        <Tooltip title="Border Color">
          <ColorPicker
            onChange={handleBorderColorChange}
            size="small"
            defaultValue={"#D81B60"}
            placement="bottomLeft"
          />
        </Tooltip>
        <Tooltip title="Font Size">
          <InputNumber
            min={8}
            max={50}
            defaultValue={18}
            onChange={handleFontSizeChange}
            size="small"
            style={{ width: "50px" }}
          />
        </Tooltip>
        <Button
          onClick={handleFontTypeChange}
          size="small"
          icon={<BoldOutlined />}
        />
        <Button
          onClick={handleFontStyleChange}
          size="small"
          icon={<ItalicOutlined />}
        />
        <Tooltip title="Font Color">
          <ColorPicker
            onChange={handleFontColorChange}
            size="small"
            defaultValue={"#fff"}
            placement="bottomLeft"
          >
            <Button size="small" icon={<FontColorsOutlined />} />
          </ColorPicker>
        </Tooltip>
      </div>
    </div>
  );
};

export default ContextMenu;
