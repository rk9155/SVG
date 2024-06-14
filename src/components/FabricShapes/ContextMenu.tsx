import React, { useState } from "react";
import { Radio } from "antd";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  visible,
  x,
  y,
  onDelete,
  onBringToFront,
  onSendToBack,
}) => {
  const [size, setSize] = useState("large");
  if (!visible) return null;

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
      <Radio.Group value={size} onChange={(e) => setSize(e.target.value)}>
        <Radio.Button value="large" onClick={onDelete}>
          Delete
        </Radio.Button>
        <Radio.Button value="default" onClick={onBringToFront}>
          Bring to Front
        </Radio.Button>
        <Radio.Button value="small" onClick={onSendToBack}>
          Send to Back
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default ContextMenu;
