/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from "fabric";
import { Textbox, classRegistry } from "fabric";

export default class GroupWithPolygon extends fabric.Polygon {
  static type = "GroupWithPolygon";
  test: Textbox;
  text = null;
  textOffsetLeft = 0;
  textOffsetTop = 0;
  _prevObjectStacking = null;
  _prevAngle = 0;
  canvas = new fabric.Canvas("c");
  initialFocused = false;

  constructor(...args: any) {
    super(...args);
    this.test = new Textbox("Sample", {
      fill: "#d9d9d9",
      fontSize: 24,
      objectCaching: false,
    });
    this.canvas = args.canvas;

    this.cornerColor = "blue";
    this.cornerStyle = "circle";
    this.controls = this.createPathControls();
    console.log("controls", this.controls);

    this.on("added", () => {
      this.canvas.add(this.test);
    });

    this.on("removed", () => {
      this.canvas.remove(this.test);
    });

    this.on("mousedown:before", () => {
      this._prevObjectStacking = this.canvas.preserveObjectStacking;
      this.canvas.preserveObjectStacking = true;
    });

    this.on("mousedblclick", () => {
      this.makeEditable();
    });

    this.on("deselected", () => {
      this.canvas.preserveObjectStacking = this._prevObjectStacking;
    });

    this.test.on("editing:exited", () => {
      this.test.selectable = false;
      this.test.evented = false;
      this.selectable = true;
    });
  }

  makeEditable = () => {
    this.test.selectable = true;
    this.test.evented = true;
    this.test.editable = true;
    this.canvas.setActiveObject(this.test);
    this.test.enterEditing();
    this.selectable = false;
  };

  createPathControls() {
    const controls = { ...this.controls };

    controls["p0"] = new fabric.Control({
      x: 0.5,
      y: 0.2,
      offsetX: 0,
      offsetY: 0,
      actionHandler: this.modifyPolygon.bind(this, 4),
      actionName: "modifyPolygon",
      pointIndex: 4,
      positionHandler: this.polygonPositionHandler.bind(this, 4),
    });

    return controls;
  }

  polygonPositionHandler(index: number, dim, finalMatrix, fabricObject) {
    const x = fabricObject.points[index].x - fabricObject.pathOffset.x;
    const y = fabricObject.points[index].y - fabricObject.pathOffset.y;
    return fabric.util.transformPoint(
      { x: x, y: y },
      fabric.util.multiplyTransformMatrices(
        fabricObject.canvas.viewportTransform,
        fabricObject.calcTransformMatrix()
      )
    );
  }

  modifyPolygon(
    index: number,
    eventData: MouseEvent,
    transform: fabric.Transform,
    x: number,
    y: number
  ) {
    const polygon = transform.target as fabric.Polygon;
    const point = polygon.points[index];
    const offsetX = x - (polygon.left + polygon.width / 2);
    const offsetY = y - (polygon.top + polygon.height / 2);

    point.x = offsetX;
    point.y = offsetY;

    polygon.set({ dirty: true });
    this.canvas.requestRenderAll();
    return true;
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    this.test.editable = true;
    this.test.left =
      this.left +
      (this.aCoords.tr.x - this.aCoords.tl.x) / 2 -
      this.test.width / 2;

    this.test.top =
      this.top +
      (this.oCoords.ml.y - this.oCoords.tl.y) / 2 -
      this.test.height / 2;

    // this.test.left = this.left;
    // this.test.top = this.top;
    // this.test.originX = "center";
    // this.test.originY = "center";
    console.log({ all: this });

    if (!this.initialFocused) {
      this.makeEditable();
      this.initialFocused = true;
    }
    this.test.render(ctx);
  }
}

classRegistry.setClass(GroupWithPolygon);
