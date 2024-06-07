/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";

interface IHighlightProps {
    id: number;
    x: number; 
    y: number;
    width: number; 
    height: number; 
    onDrag: (newX: number, newY: number) => void
    onResize: (newWidth: number, newHeight: number) => void;
    isRectangle: boolean;
}

const Highlight: React.FC<IHighlightProps> = (props) => {
  const { x, y, width, height, onDrag, onResize, isRectangle } =props;
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: any, action: string) => {
    e.stopPropagation();
    setOffset({ x: e.clientX, y: e.clientY });

    if (action === "drag") {
      setDragging(true);
    } else {
      setResizing(action);
    }
  };

  const handleMouseMove = (e: any): void => {
    if (dragging) {
      onDrag(x + (e.clientX - offset.x), y + (e.clientY - offset.y));
      setOffset({ x: e.clientX, y: e.clientY });
    } else if (resizing) {
      const dx = e.clientX - offset.x;
      const dy = e.clientY - offset.y;

      if (resizing === "right") {
        onResize(width + dx, height);
      } else if (resizing === "bottom") {
        onResize(width, height + dy);
      } else if (resizing === "left") {
        onResize(width - dx, height);
        onDrag(x + dx, y);
      } else if (resizing === "top") {
        onResize(width, height - dy);
        onDrag(x, y + dy);
      } else if (resizing === "bottomRight") {
        onResize(width + dx, height + dy);
      } else if (resizing === "topLeft") {
        onResize(width - dx, height - dy);
        onDrag(x + dx, y + dy);
      }

      setOffset({ x: e.clientX, y: e.clientY });
    } 
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove]);

  return (
    <svg width="100%" height="100%">

    <g>
      <path
        d={`M${x},${y} h${width} v${height} h-${width} Z`}
        fill= {isRectangle ? "000" : "transparent"}
        stroke="blue"
        strokeWidth="5"
        onMouseDown={(e) => handleMouseDown(e, "drag")}
        r="20"
      />
      <circle
        cx={x + width}
        cy={y + height / 2}
        r="5"
        fill="red"
        onMouseDown={(e) => handleMouseDown(e, "right")}
      />
      <circle
        cx={x + width / 2}
        cy={y + height}
        r="5"
        fill="red"
        onMouseDown={(e) => handleMouseDown(e, "bottom")}
      />
      <circle
        cx={x}
        cy={y + height / 2}
        r="5"
        fill="red"
        onMouseDown={(e) => handleMouseDown(e, "left")}
      />
      <circle
        cx={x + width / 2}
        cy={y}
        r="5"
        fill="red"
        onMouseDown={(e) => handleMouseDown(e, "top")}
      />
      <circle
        cx={x + width}
        cy={y + height}
        r="5"
        fill="blue"
        onMouseDown={(e) => handleMouseDown(e, "bottomRight")}
      />
      <circle
        cx={x}
        cy={y}
        r="5"
        fill="blue"
        onMouseDown={(e) => handleMouseDown(e, "topLeft")}
      />
    </g>
    </svg>
  );
};

export default Highlight;
