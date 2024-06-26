import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import ActionPanel from "./ActionPanel";
import { Button, Col, Row } from "antd";

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

    if (event.target) {
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
    }
  };

  useEffect(() => {
    const canvasDiv = document.getElementById(
      "canvas-div"
    ) as HTMLCanvasElement;
    if (canvasDiv) {
      fabricCanvas.current = new fabric.Canvas(canvasDiv, {
        width: 1000,
        height: 600,
      });
    }
    fabricCanvas.current.on("mouse:down", (event: any) => {
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
      selectedObject.on("contextmenu", (ev: any) => {
        ev.e.preventDefault();
        positionContextMenu(ev);
      });
      selectedObject.on("scaling", () => {
        setContextMenu({ visible: false, x: 0, y: 0 });
      });
      selectedObject.on("modified", (event: any) => {
        positionContextMenu(event);
      });
    }
  }, [selectedObject]);

  const handleDelete = () => {
    if (selectedObject && fabricCanvas.current) {
      fabricCanvas.current.remove(selectedObject);
      setContextMenu({ visible: false, x: 0, y: 0 });
    }
  };

  return (
    <Row>
      <Col flex={4} style={{ background: "rgba(0,0,0,0.2", padding: "10px" }}>
        <canvas id="canvas-div" />
        <ContextMenu
          visible={contextMenu.visible}
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleDelete}
          fabricCanvas={fabricCanvas}
        />
      </Col>
      <Col flex={1} style={{ padding: "10px" }}>
        <ActionPanel fabricCanvas={fabricCanvas} />
      </Col>
    </Row>
  );
};

export default FabricEditor;
