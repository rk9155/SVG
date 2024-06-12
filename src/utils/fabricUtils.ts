/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from "fabric";
import { classRegistry, Rect, Textbox } from 'fabric';

export default class GroupWithText extends Rect {
  static type = 'GroupWithText';
  test: Textbox;
  poly: fabric.Triangle;
  text = null;
  textOffsetLeft= 0;
  textOffsetTop = 0;
  _prevObjectStacking = null;
  _prevAngle=0;
  canvas=new fabric.Canvas('c');

  constructor(args: any) {
    super(args);

    this.poly = new fabric.Triangle({
      fill: '#D81B60',
      strokeWidth: 2,
      stroke: 'green',
      scaleX: 1,
      scaleY: 1,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue',
      top: this.top + this.height
	})

    this.test = new Textbox('test', {
      width: this.width,
      height: this.height,
      fill: '#d9d9d9',
      fontSize: 24,
      objectCaching: false,
      top: this.height/2,
    })

    this.canvas = args.canvas;
      this.on('scaling', (e) => {
        console.log('event', e);
        console.log('rect', this.height, this.width, this.scaleX);

        this.test.set('width', this.scaleX*this.width);
        this.test.set('height', this.scaleY*this.height);
        console.log('text', this.test.height, this.test.width);
      })
      this.on('added', () => {
        this.canvas.add(this.test)
      })
      this.on('removed', () => {
        this.canvas.remove(this.test)
      })
      this.on('mousedown:before', () => {
        this._prevObjectStacking = this.canvas.preserveObjectStacking
        this.canvas.preserveObjectStacking = true
      })
      this.on('mousedblclick', () => {
        this.test.selectable = true
        this.test.evented = true
        this.canvas.setActiveObject(this.test)
        this.test.enterEditing()
        this.selectable = false
      })

      this.on('deselected', () => {
        this.canvas.preserveObjectStacking = this._prevObjectStacking
      })
      
      this.test.on('editing:exited', () => {
        this.test.selectable = false
        this.test.evented = false
        this.selectable = true
      })

      this.test.on('changed', () => {
        this.set('width', this.test.width);
        this.set('height', this.test.height);
      })
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    this.test.left = this.left;
    this.test.top = this.top;
    this.test.width = this.width;
    this.test.height = this.height;
    this.test.render(ctx);
    this.poly.render(ctx);
  }
}

classRegistry.setClass(GroupWithText);