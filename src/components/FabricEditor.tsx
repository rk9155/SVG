import { useRef, useState } from "react";

const SvgEditor = () => {
  const [rect, setRect] = useState({ x: 20, y: 20, width: 240, height: 100 });
  const [arrow, setArrow] = useState({
    baseX: 140,
    baseY: 20,
    tipX: 140,
    tipY: 0,
  });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState("");
  const [draggingElement, setDraggingElement] = useState("");
   const [text, setText] = useState("");
   const [textEditing, setTextEditing] = useState(false);

  const svgRef = useRef(null);
  const inputRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

   const handleDblClick = (e) => {
    e.stopPropagation();
    setTextEditing(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  const handleBlur = (e) => {
    setTextEditing(false);
  }

  const handleMouseDown = (e, element, direction) => {
    e.stopPropagation();
    if (direction) {
      setResizing(true);
      setResizeDirection(direction);
    } else {
      setDragging(true);
    }
    setDraggingElement(element);
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
    setResizeDirection("");
    setDraggingElement("");
  };

const updateArrowPosition = (newRect) => {
    let newBaseX = arrow.baseX;
    let newBaseY = arrow.baseY;

    // Determine the closest edge for the base of the arrow
    if (arrow.tipX < newRect.x) {
      newBaseX = newRect.x; // Left edge
      newBaseY = Math.max(newRect.y, Math.min(newRect.y + newRect.height, arrow.tipY));
    } else if (arrow.tipX > newRect.x + newRect.width) {
      newBaseX = newRect.x + newRect.width; // Right edge
      newBaseY = Math.max(newRect.y, Math.min(newRect.y + newRect.height, arrow.tipY));
    } else if (arrow.tipY < newRect.y) {
      newBaseX = Math.max(newRect.x, Math.min(newRect.x + newRect.width, arrow.tipX));
      newBaseY = newRect.y; // Top edge
    } else if (arrow.tipY > newRect.y + newRect.height) {
      newBaseX = Math.max(newRect.x, Math.min(newRect.x + newRect.width, arrow.tipX));
      newBaseY = newRect.y + newRect.height; // Bottom edge
    }

    setArrow({
      ...arrow,
      baseX: newBaseX,
      baseY: newBaseY,
    });
  };


  const handleMouseMove = (e) => {
    if (!dragging && !resizing) return;

    const svg = svgRef.current;
    const rectSVG = svg.getBoundingClientRect();
    const offsetX = e.clientX - rectSVG.left;
    const offsetY = e.clientY - rectSVG.top;

    if (resizing && draggingElement === "rect") {
      const newRect = { ...rect };
      switch (resizeDirection) {
        case "top-left":
          newRect.x = offsetX;
          newRect.y = offsetY;
          newRect.width = rect.width + (rect.x - offsetX);
          newRect.height = rect.height + (rect.y - offsetY);
          break;
        case "top-center":
          newRect.y = offsetY;
          newRect.height = rect.height + (rect.y - offsetY);
          break;
        case "top-right":
          newRect.y = offsetY;
          newRect.width = offsetX - rect.x;
          newRect.height = rect.height + (rect.y - offsetY);
          break;
        case "center-left":
          newRect.x = offsetX;
          newRect.width = rect.width + (rect.x - offsetX);
          break;
        case "center-right":
          newRect.width = offsetX - rect.x;
          break;
        case "bottom-left":
          newRect.x = offsetX;
          newRect.width = rect.width + (rect.x - offsetX);
          newRect.height = offsetY - rect.y;
          break;
        case "bottom-center":
          newRect.height = offsetY - rect.y;
          break;
        case "bottom-right":
          newRect.width = offsetX - rect.x;
          newRect.height = offsetY - rect.y;
          break;
        default:
          break;
      }
      if (newRect.width >= 20 && newRect.height >= 20) {
        setRect(newRect);
        updateArrowPosition(newRect);
      }
    } else if (resizing && draggingElement === "arrow" && resizeDirection === "tip") {
      setArrow((prev) => ({
        ...prev,
        tipX: offsetX,
        tipY: offsetY,
      }));
    } else if (dragging && draggingElement === "rect") {
      const newRect = {
        ...rect,
        x: offsetX - rect.width / 2,
        y: offsetY - rect.height / 2,
      };

      setRect(newRect);
      setArrow((prev) => ({
        ...prev,
        baseX: prev.baseX + (offsetX - (rect.x + rect.width / 2)),
        baseY: prev.baseY + (offsetY - (rect.y + rect.height / 2)),
        tipX: prev.tipX + (offsetX - (rect.x + rect.width / 2)),
        tipY: prev.tipY + (offsetY - (rect.y + rect.height / 2)),
      }));
    } else if (dragging && draggingElement === "arrow") {
      setArrow((prev) => ({
        ...prev,
        baseX: offsetX,
        baseY: offsetY,
      }));
    }
  };

  const renderResizeHandles = () => {
    const directions = [
      "top-left",
      "top-center",
      "top-right",
      "center-left",
      "center-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
    return directions.map((direction) => {
      let cx, cy;
      switch (direction) {
        case "top-left":
          cx = rect.x;
          cy = rect.y;
          break;
        case "top-center":
          cx = rect.x + rect.width / 2;
          cy = rect.y;
          break;
        case "top-right":
          cx = rect.x + rect.width;
          cy = rect.y;
          break;
        case "center-left":
          cx = rect.x;
          cy = rect.y + rect.height / 2;
          break;
        case "center-right":
          cx = rect.x + rect.width;
          cy = rect.y + rect.height / 2;
          break;
        case "bottom-left":
          cx = rect.x;
          cy = rect.y + rect.height;
          break;
        case "bottom-center":
          cx = rect.x + rect.width / 2;
          cy = rect.y + rect.height;
          break;
        case "bottom-right":
          cx = rect.x + rect.width;
          cy = rect.y + rect.height;
          break;
        default:
          break;
      }
      return (
        <circle
          key={direction}
          cx={cx}
          cy={cy}
          r="8"
          fill="#0077b6"
          className="resize-handle"
          onMouseDown={(e) => handleMouseDown(e, "rect", direction)}
          style={{
            cursor: `${direction.includes("top") || direction.includes("bottom") ? "ns" : "ew"}-resize`,
          }}
        />
      );
    });
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onDoubleClick={handleDblClick} style={{ margin: 50, width: '800px', height: '100px', position: 'relative' }}>
      <svg ref={svgRef} height="1200" width="1000" onMouseLeave={handleMouseUp} style={{position: 'absolute'}}>
        {/* <defs>
          <clipPath id="rectClip">
            <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
          </clipPath>
        </defs> */}
        <g>
          <path
            d={`M ${arrow.baseX - 20} ${arrow.baseY} L ${arrow.baseX + 20} ${arrow.baseY} L ${arrow.tipX} ${arrow.tipY} Z`}
            fill="#000"
            stroke="#000"
            strokeWidth="1"
            style={{ pointerEvents:"none" }}
          />
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill="#d9d9d9"
            stroke="#000"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeMiterlimit="8"
            onMouseDown={(e) => handleMouseDown(e, "rect", "")}
            style={{ cursor: "move" }}
          />
          {renderResizeHandles()}
                      <foreignObject x={rect.x} y={rect.y} width={rect.width} height={rect.height}
            onMouseDown={(e) => handleMouseDown(e, "rect", "")}
            style={{ pointerEvents: "none" }}>
            {textEditing ? (
                <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <textarea
                ref={inputRef}
                value={text}
                onChange={handleTextChange}
                onBlur={handleBlur}
                style={{
                  resize: "none",
                  overflow: "hidden",
                  width: '100%', 
                  height: '100%',
                  padding: "5px",
                  border: "none",
                  background: "transparent",
                  textAlign: "center",
                }}
              />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
                onDoubleClick={handleDblClick}
              >
                {text}
              </div>
                )}
          </foreignObject>
          <path
            d={`M ${arrow.baseX - 20} ${arrow.baseY} L ${arrow.baseX + 20} ${arrow.baseY} L ${arrow.tipX} ${arrow.tipY} Z`}
            fill="none"
            stroke="none"
            onMouseDown={(e) => handleMouseDown(e, "arrow", "")}
            style={{ cursor: "move" }}
          />
          <circle
            cx={arrow.tipX}
            cy={arrow.tipY}
            r="8"
            fill="#0077b6"
            className="resize-handle"
            onMouseDown={(e) => handleMouseDown(e, "arrow", "tip")}
            style={{ cursor: "nwse-resize" }}
          />
        </g>
      </svg>
    </div>
  );
};

export default SvgEditor;
