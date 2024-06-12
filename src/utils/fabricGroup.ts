/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from "fabric";
import { classRegistry } from 'fabric';

export default class GroupWithGroup extends fabric.Group {
  static type = 'GroupWithGroup';
  test: fabric.Textbox;
  rect: fabric.Rect;
  text = null;
  textOffsetLeft= 0;
  textOffsetTop = 0;
  _prevObjectStacking = null;
  _prevAngle=0;
  canvas=new fabric.Canvas('c');

  constructor(args: any) {
    super(args);
    this.test = args[1];
    this.rect = args[0];

    this.on('scaling', (e) => {
        console.log('event', e);
        console.log('rect', this.height, this.width, this.scaleX);

        this.test.set('width', this.scaleX*this.width);
        this.test.set('height', this.scaleY*this.height);
        this.test.set('scaleX', 1);
        this.test.set('scaleY', 1);
        console.log('text', this.test.height, this.test.width, this.scaleX);
      })
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
  }
}

classRegistry.setClass(GroupWithGroup);