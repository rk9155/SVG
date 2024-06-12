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
  selected = false;

  constructor(...args: any) {
    super(...args);
    this.test = new Textbox("", {
      fill: "#d9d9d9",
      fontSize: 18,
      objectCaching: false,
      textAlign: "center",
    });

    document.addEventListener("keyup", (event) => {
      if (event && this.selected) {
        this.makeEditable();
        this.selected = false;
      }
    });

    this.test.on("selected", () => {
      console.log("text added");
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
      this.selected = false;
    });

    this.on("selected", () => {
      this.selected = true;
    });

    this.test.on("editing:exited", () => {
      this.test.selectable = false;
      this.test.evented = false;
      this.selectable = true;
    });

    // this.on("scaling", () => {
    //   this.test.width = this.points[0].x * this.scaleX;
    //   this.test.height = (this.points[2].y - this.points[1].y) * this.scaleY;
    // });
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
      render: function (ctx, left, top) {
        ctx.save();
        const size = 8;
        const stroke = "orange";
        const fill = "orange";
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(left, top, size / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      },
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
    __: MouseEvent,
    transform: fabric.Transform,
    x: number,
    y: number
  ) {
    const polygon = transform.target as fabric.Polygon;
    const point = polygon.points[index];
    const offsetX = x - polygon.left;
    const offsetY = y - polygon.top;

    point.x = offsetX;
    point.y = offsetY;

    // polygon.set({ dirty: true });

    // this.canvas.requestRenderAll();
    return true;
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    this.test.left = this.left + (this.points[1].x * this.scaleX) / 2;

    this.test.top =
      this.top + ((this.points[2].y - this.points[1].y) * this.scaleY) / 2;
    this.test.originX = "center";
    this.test.originY = "center";
    this.test.selectable = true;
    // this.test.width = 200;

    if (this.test.width >= this.points[1].x * (this.scaleX - 0.6)) {
      console.log("Exceeded");
      this.scaleX = this.scaleX + 0.3;
    }
    if (
      this.test.height >=
      (this.points[2].y - this.points[1].y) * this.scaleY
    ) {
      console.log("Exceeded");
      this.scaleY = this.scaleY + 0.3;
    }
    // this.test.width = this.width;
    if (!this.initialFocused) {
      this.makeEditable();
      this.initialFocused = true;
    }
    this.test.render(ctx);
  }
}

classRegistry.setClass(GroupWithPolygon);
