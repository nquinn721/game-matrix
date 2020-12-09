import { Item } from "./item";
export class Player extends Item {
  public id: number = 0;
  public type: string = "player";
  public name: string = "Bob";
  public x: number = 10;
  public y: number = 10;
  public w: number = 50;
  public h: number = 30;
  public power: number = 10;
  public xp: number = 0;
  public speed: number = 5;
  public originalSpeed: number = 5;
  public deg: number = 0;
  public group: number = 1;
  public level: number = 0;
  public matrixSegment: any;

  constructor(obj: any = {}, public map: any = {}) {
    super();
    this.id = obj.id;

    this.init(obj);
  }

  init(obj: any) {
    Object.assign(this, obj);
    this.dynamicRect();
  }

  loop() {
    this.isMoving && this.move();
    (this.isRotating.left || this.isRotating.right) && this.rotate();
    // this.checkMatrixSegment();
  }

  // checkMatrixSegment() {
  //   if (this.matrixSegment) {
  //     let pos = this.body.position;
  //     if (
  //       pos.x <= this.matrixSegment.x ||
  //       pos.x >= this.matrixSegment.endx ||
  //       pos.y <= this.matrixSegment.y ||
  //       pos.y >= this.matrixSegment.endy
  //     ) {
  //       this.movePlayerSegment(this);
  //     }
  //   }
  // }

  // plain() {
  //   let pos = this.body.position;
  //   return {
  //     x: pos.x,
  //     y: pos.y,
  //     w: this.w,
  //     h: this.h,
  //     angle: this.getAngle(),
  //     power: this.power,
  //     hp: this.hp,
  //     id: this.id,
  //     type: this.type,
  //     level: this.level,
  //   };
  // }
}
