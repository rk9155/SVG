import { useRef, useState } from 'react';

const SVGEditor = () => {
  const [rect, setRect] = useState({ x: 50, y: 50, width: 200, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const rectRef = useRef(null);

  const handleMouseDown = (e, handleDirection) => {
    const { clientX, clientY } = e;
    const { x, y, width, height } = rect;

    if (handleDirection) {
      setIsResizing(true);
      setResizeDirection(handleDirection);
    } else if (isNearRectEdge(clientX, clientY, x, y, width, height)) {
      setIsResizing(true);
      setResizeDirection(getResizeDirection(clientX, clientY, x, y, width, height));
    } else {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;

    if (isResizing) {
      resizeRect(clientX, clientY);
    } else if (isDragging) {
      dragRect(clientX, clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const resizeRect = (clientX, clientY) => {
    const { x, y, width, height } = rect;
    const newRect = { ...rect };

    if (resizeDirection === 'nw') {
      newRect.width = width + x - clientX;
      newRect.height = height + y - clientY;
      newRect.x = clientX;
      newRect.y = clientY;
    } else if (resizeDirection === 'ne') {
      newRect.width = clientX - x;
      newRect.height = height + y - clientY;
      newRect.y = clientY;
    } else if (resizeDirection === 'sw') {
      newRect.width = width + x - clientX;
      newRect.height = clientY - y;
      newRect.x = clientX;
    } else if (resizeDirection === 'se') {
      newRect.width = clientX - x;
      newRect.height = clientY - y;
    }

    setRect(newRect);
  };

  const dragRect = (clientX, clientY) => {
    const { x, y, width, height } = rect;
    const newRect = { ...rect };

    newRect.x = clientX - (width / 2);
    newRect.y = clientY - (height / 2);

    setRect(newRect);
  };

  return (
    <svg>
      <rect
        ref={rectRef}
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        fill="pink"
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <ResizeHandle
        direction="nw"
        x={rect.x - 5}
        y={rect.y - 5}
        onMouseDown={(e) => handleMouseDown(e, 'nw')}
      />
      <ResizeHandle
        direction="ne"
        x={rect.x + rect.width - 5}
        y={rect.y - 5}
        onMouseDown={(e) => handleMouseDown(e, 'ne')}
      />
      <ResizeHandle
        direction="sw"
        x={rect.x - 5}
        y={rect.y + rect.height - 5}
        onMouseDown={(e) => handleMouseDown(e, 'sw')}
      />
      <ResizeHandle
        direction="se"
        x={rect.x + rect.width - 5}
        y={rect.y + rect.height - 5}
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />
    </svg>
  );
};

const ResizeHandle = ({ direction, x, y, onMouseDown }) => {
  return (
    <rect
      x={x}
      y={y}
      width={10}
      height={10}
      fill="blue"
      onMouseDown={onMouseDown}
      style={{ cursor: resizeCursorMap[direction] }}
    />
  );
};

const resizeCursorMap = {
  nw: 'nw-resize',
  ne: 'ne-resize',
  sw: 'sw-resize',
  se: 'se-resize',
};

// Helper functions
const isNearRectEdge = (clientX, clientY, x, y, width, height) => {
  const edgeSize = 10; // Adjust this value to change the sensitivity of the resize area
  const withinX = clientX >= x - edgeSize && clientX <= x + width + edgeSize;
  const withinY = clientY >= y - edgeSize && clientY <= y + height + edgeSize;
  return withinX && withinY;
};

const getResizeDirection = (clientX, clientY, x, y, width, height) => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  if (clientX < x + halfWidth && clientY < y + halfHeight) {
    return 'nw';
  } else if (clientX >= x + halfWidth && clientY < y + halfHeight) {
    return 'ne';
  } else if (clientX < x + halfWidth && clientY >= y + halfHeight) {
    return 'sw';
  } else {
    return 'se';
  }
};

export default SVGEditor;