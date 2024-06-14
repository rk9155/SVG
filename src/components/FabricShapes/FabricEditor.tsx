/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import GroupWithPolygon from "../../utils/fabricPolygon";
import ContextMenu from "./ContextMenu";

const FabricEditor = () => {
  const fabricCanvas =
    useRef<fabric.Canvas>() as React.MutableRefObject<fabric.Canvas>;

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
    null
  );

  const positionContextMenu = (
    event: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    // Get canvas offset within the document
    const canvasRect = fabricCanvas.current
      .getElement()
      .getBoundingClientRect();

    // Get the bounding box of the selected object
    const boundingBox = event.target.getBoundingRect();
    const { left, top, width, height } = boundingBox;

    // Calculate object dimensions with scaling
    const scaledWidth = width * event.target.scaleX;
    const scaledHeight = height * event.target.scaleY;

    const menuWidth = 150; // Approximate width of the context menu
    const menuHeight = 100; // Approximate height of the context menu

    // Determine the best fit position
    let posX = left + scaledWidth + 10; // Default to right
    let posY = top; // Align with the top of the object

    // If the object is in the right 30% of the canvas, move the menu above the object
    const rightBoundary = canvasRect.width * 0.7;
    if (left + scaledWidth > rightBoundary) {
      posX = left; // Align with the left of the object
      posY = top - menuHeight - 10; // Move above the object

      // Ensure the menu does not go out of the top boundary
      if (posY < 0) {
        posY = top + scaledHeight + 10; // Move below the object if it goes out of the top boundary
      }
    }

    // Ensure the final position is within canvas boundaries
    posX = Math.min(Math.max(posX, 0), canvasRect.width - menuWidth);
    posY = Math.min(Math.max(posY, 0), canvasRect.height - menuHeight);

    // Convert to absolute positioning
    setContextMenu({
      visible: true,
      x: canvasRect.left + posX,
      y: canvasRect.top + posY,
    });
  };

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

    fabricCanvas.current.on("mouse:down", (event) => {
      if (event.e.button === 0 || event.e.button === 3) {
        if (event.target) {
          setSelectedObject(event.target);
          positionContextMenu(event);
        } else {
          setContextMenu({ visible: false, x: 0, y: 0 });
        }
      } else {
        setContextMenu({ visible: false, x: 0, y: 0 });
      }
    });

    fabricCanvas.current
      .getElement()
      .addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });

    return () => {
      if (fabricCanvas.current) {
        fabricCanvas.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedObject) {
      selectedObject.on("moving", () => {
        setContextMenu({ visible: false, x: 0, y: 0 });
      });
      selectedObject.on("contextmenu", (ev) => {
        ev.e.preventDefault();
        positionContextMenu(ev);
      });
      selectedObject.on("scaling", () => {
        setContextMenu({ visible: false, x: 0, y: 0 });
      });
      selectedObject.on("modified", (event) => {
        positionContextMenu(event);
      });
    }
  }, [selectedObject]);

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
    const pointBottom = [
      {
        x: 0,
        y: 0,
      },
      {
        x: 100,
        y: 0,
      },
      {
        x: 100,
        y: 50,
      },
      {
        x: 50,
        y: 50,
      },
      {
        x: 60,
        y: 70,
      },
      {
        x: 70,
        y: 50,
      },
      {
        x: 0,
        y: 50,
      },
    ];

    const polygon = new GroupWithPolygon(
      pointBottom,
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
      fabricCanvas.current
    );
    fabricCanvas.current.add(polygon);
    fabricCanvas.current.renderAll();
  };

  const handleDelete = () => {
    if (selectedObject && fabricCanvas.current) {
      fabricCanvas.current.remove(selectedObject);
      setContextMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const handleBringToFront = () => {
    if (selectedObject && fabricCanvas.current) {
      fabricCanvas.current.bringToFront(selectedObject);
      setContextMenu({ visible: false, x: 0, y: 0 });
    }
  };

  const handleSendToBack = () => {
    if (selectedObject && fabricCanvas.current) {
      fabricCanvas.current.sendToBack(selectedObject);
      setContextMenu({ visible: false, x: 0, y: 0 });
    }
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
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects();
            objects[1].set({ fontSize: objects[1].fontSize + 2 });
            fabricCanvas.current.renderAll();
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            const objects = fabricCanvas.current.getObjects();
            objects[1].set({
              fontSize: objects[1].fontSize - 2,
            });
            fabricCanvas.current.renderAll();
          }}
        >
          -
        </button>
      </div>
      <div>
        <canvas id="canvas-div" />
        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleDelete}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
        />
      </div>
    </div>
  );
};

export default FabricEditor;
