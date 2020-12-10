import { TCoords, IItem } from "../../types";
import { Item } from "./Item";

export class MapElement {
  public static items: any = {};
  public static dropItems = [];
  constructor() {
    // this.dropItems = {
    //   health: [
    //     { type: "healthPotion", size: "large" },
    //     { type: "healthPotion", size: "medium" },
    //     { type: "healthPotion", size: "small" }
    //   ],
    //   powerUp: [{ type: "icon", power: "gun" }],
    //   levelUp: [{ type: "coin" }],
    //   powers: [{ type: "icon", power: "mine" }]
    // };
  }
  static create(obj: any): IItem | void {
    const item = this.items[obj.type];
    if (item) return new item(obj);
  }

  static drop(coords: TCoords) {
    return this.randomItem(coords);
  }

  static dropMultiple(coords: TCoords[]) {
    return coords.map(this.drop.bind(this));
  }

  static possibleDrop(coords: TCoords) {
    return this.randomItem(coords);
  }

  static randomItem(coords: TCoords) {
    // let dropItemKeys = Object.keys(this.dropItems),
    //   key: string = dropItemKeys[Math.floor(Math.random() * dropItemKeys.length)],
    //   val = Math.floor(Math.random() * this.dropItems[key].length);
    // let item = Object.assign({}, this.dropItems[key][val]);
    // item.x = x;
    // item.y = y;
    // return item;
  }

  static registerItem(obj: any) {
    const item = new obj();
    if (!item.type) throw new Error("Item needs to have `type` as a property");
    const type = item.type;
    this.items[type] = obj;
  }
}
