import { Emitter } from "./Emitter";
import { physics, BODY } from "./matteritem";
import { TCoords, TCoordsExt, TItem } from "./types";

type s = {
  [key: string]: any;
};
class Item {
  public id: number = 0;
  public gameId: number = 0;
  public w: number = 0;
  public h: number = 0;
  public x: number = 0;
  public y: number = 0;
  public hp: number = 0;
  public totalHP: number = 0;
  public matrixSegment: number = 0;

  public isRotating: s = {
    left: false,
    right: false,
  };
  public body: any;
  public angle: number = 0;
  public speed: number = 0;
  public isMoving: boolean = false;
  public destroyed: boolean = false;
  public type: string = "";

  dynamicRect(options: any) {
    this.rect("dynamic", options);
  }

  staticRect(options: any) {
    this.rect("static", options);
  }

  rect(bodyType: any, options: any) {
    let { body } = physics.rect(this, bodyType, options);
    this.body = body;
  }

  setVelocity(obj: any) {
    BODY.setVelocity(this.body, obj);
  }

  rotate() {
    let dir = this.isRotating.right ? 0.05 : -0.05;
    BODY.setAngularVelocity(this.body, dir);
    this.angle = this.body.angle;
  }

  move(d?: any) {
    let dir = d || this.isMoving;
    const angle = this.body.angle;

    const velX = Math.cos(angle) * this.speed;
    const velY = Math.sin(angle) * this.speed;

    if (dir === "back") dir = { x: -(velX * 0.7), y: -velY * 0.7 };
    else dir = { x: velX, y: velY };

    if (this.type === "bullet") BODY.setVelocity(this.body, dir);
    else
      BODY.applyForce(this.body, this.body.position, {
        x: dir.x * 40,
        y: dir.y * 40,
      });
    Object.assign(this, this.body.position);
  }

  startMoving({ dir }: any) {
    this.isMoving = dir;
  }
  stopMoving() {
    this.isMoving = false;
  }

  setPosition(pos: TCoords) {
    Object.assign(this, pos);
    BODY.setPosition(this.body, pos);
  }
  getPosition() {
    return this.body.position;
  }
  setAngleWithCoords({ x, y, x1, y1 }: TCoordsExt) {
    let angle = Math.atan2(y - y1, x - x1);

    this.setAngle(angle);
  }
  setAngle(angle: number) {
    BODY.setAngle(this.body, angle);
    this.angle = angle;
  }
  getAngle() {
    return this.body.angle;
  }
  startRotating({ dir }: { dir: string }) {
    this.isRotating[dir] = true;
  }

  stopRotating({ dir }: { dir: string }) {
    this.isRotating[dir] = false;
    BODY.setAngularVelocity(this.body, 0);
    if (this.isRotating.left) BODY.setAngularVelocity(this.body, 0.05);
    if (this.isRotating.right) BODY.setAngularVelocity(this.body, -0.05);
  }

  destroy(emit: boolean) {
    this.destroyed = true;
    if (this.body) {
      this.body.destroyed = true;
      physics.destroy();
    }

    emit !== false && Emitter.emit("destroy", { obj: this.plain(), gameId: this.gameId });
  }

  createMultiple(items: TItem[]) {
    items.forEach(this.create.bind(this));
  }
  create(obj: any) {
    if (obj) obj.owner = this.id;
    this.gameId && Emitter.emit("create", { obj, gameId: this.gameId });
  }

  damage(dam: number) {
    this.hp -= dam;
  }

  addHP(hp: number) {
    if (this.hp < this.totalHP) {
      this.hp += hp;
      if (this.hp > this.totalHP) this.hp = this.totalHP;
    }
  }

  collides(obj: any) {}

  getSpawnPoints(coords: TCoords[]) {
    return coords.map(this.getSpawnPoint.bind(this));
  }

  getSpawnPoint({ movex, movey }: any) {
    if (Array.isArray(movex)) {
      movey = movex[1];
      movex = movex[0];
    } else if (movex instanceof Object) {
      movey = movex.y;
      movex = movex.x;
    }

    let pos = this.getPosition(),
      x = pos.x + movex,
      y = pos.y + movey;
    return { x, y };
  }

  plain() {
    return {
      type: this.type,
      w: this.w,
      h: this.h,
      x: this.x,
      y: this.y,
      id: this.id,
      matrixSegment: this.matrixSegment,
    };
  }
}
export default Item;
