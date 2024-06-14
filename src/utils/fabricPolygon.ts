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
  pointIndex=0;
  widthPointer={x1: 0, x2: 1};
  heightPointer={y1: 1, y2: 2};
  arrowType= 'bottom';

  constructor(...args: any) {
    super(...args);
    this.test = new Textbox("", {
      fill: "#d9d9d9",
      fontSize: 18,
      objectCaching: false,
      textAlign: "center",
      width: this.width,
      height: this.height,
      hasBorders: false,
    });

    this.canvas = args[2];
    this.pointIndex = args[3];
    this.widthPointer = args[4];
    this.heightPointer = args[5];
    this.arrowType = args[6];

    this.cornerColor = "blue";
    this.cornerStyle = "circle";
    this.controls = this.createPathControls();

    document.addEventListener("keyup", (event) => {
      if (event && this.selected) {
        this.makeEditable();
        this.selected = false;
      }
    });

    this.test.on('mousedown', ()=> {
        this.canvas.setActiveObject(this);
    })

    this.on("added", () => {
      this.canvas.add(this.test);
    });

    this.on("removed", () => {
        if(this.canvas){
            this.canvas.remove(this.test);
        }
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

    // Resize Textbox when Polygon is scaled
    this.on("scaling", () => {
      this.updateTextboxDimensions();
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
      actionHandler: this.modifyPolygon.bind(this, this.pointIndex),
      actionName: "modifyPolygon",
      pointIndex: this.pointIndex,
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
    const x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x;
    const y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
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

    // Get the scaling factors
    const scaleX = polygon.scaleX || 1;
    const scaleY = polygon.scaleY || 1;

    // Calculate the adjusted coordinates
    const offsetX = (x - polygon.left) / scaleX;
    const offsetY = (y - polygon.top) / scaleY;

    // Update the point coordinates
    point.x = offsetX;
    point.y = offsetY;
    this.updateTextboxDimensions();
    return true;
  }

  updateTextboxDimensions() {
    const polygonWidth = (this.points[this.widthPointer.x2].x - this.points[this.widthPointer.x1].x) * this.scaleX;
    const polygonHeight = (this.points[this.heightPointer.y2].y - this.points[this.heightPointer.y1].y) * this.scaleY;
    this.test.set({
      width: polygonWidth - 10,
      height: polygonHeight - 10,
    });

    this.adjustPolygonToText();
  }

  adjustPolygonToText() {
    const minWidth = 50;
    const minHeight = 50;
    const padding = 10;

    const textWidth = this.test.width + padding;
    const textHeight = this.test.height + padding;

    const newWidth = Math.max(minWidth, textWidth);
    const newHeight = Math.max(minHeight, textHeight);

    const scaleX = newWidth / ((this.points[this.widthPointer.x2].x - this.points[this.widthPointer.x1].x) || 1);
    const scaleY = newHeight / ((this.points[this.heightPointer.y2].y - this.points[this.heightPointer.y1].y) || 1);

    if(textWidth >(this.points[this.widthPointer.x2].x - this.points[this.widthPointer.x1].x) * this.scaleX){
        this.set({
          scaleX,
        });
    }

    if(textHeight >(this.points[this.heightPointer.y2].y - this.points[this.heightPointer.y1].y) * this.scaleY) {
        this.set({
            scaleY
        })
    }

    this.updateTextboxPosition();
  }

  updateTextboxPosition() {
    const extraTop = this.arrowType === 'top' ? this.points[this.pointIndex].y : 0;
    const extraLeft = this.arrowType === 'left' ? this.points[this.pointIndex].x : 0;
    this.test.set({
      left: this.left + (this.points[this.widthPointer.x2].x - this.points[this.widthPointer.x1].x) * this.scaleX / 2 - extraLeft*this.scaleX,
      top: this.top + (this.points[this.heightPointer.y2].y - this.points[this.heightPointer.y1].y) * this.scaleY / 2 - extraTop*this.scaleY,
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);

    this.test.set({
      originX: "center",
      originY: "center",
    });

    this.updateTextboxDimensions();

    if (!this.initialFocused) {
      this.makeEditable();
      this.initialFocused = true;
    }

    this.test.render(ctx);
  }
}

classRegistry.setClass(GroupWithPolygon);
