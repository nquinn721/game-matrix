import Item from "./item";
class Player extends Item {
  public id = 0;
  public type = "player";
  public name = "Bob";
  public x = 10;
  public y = 10;
  public w = 50;
  public h = 30;
  public power = 10;
  public xp = 0;
  public speed = 5;
  public originalSpeed = 0;
  public deg = 0;
  public group = 1;
  public level = 0;
  public map;

  constructor(obj: any, map: any) {
    super();
    this.id = obj.id;
    this.originalSpeed = this.speed;
    this.map = map;

    this.init(obj);
  }

  init(obj: any) {
    Object.assign(this, obj);
  }

  loop(players: any, mapItems: any, canvas: any) {
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

export default Player;
