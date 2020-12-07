type TItem = {};
type TCoord = {
  x: string | number;
  y: string | number;
};

class MapElement {
  public items: any = {};
  public dropItems = [];
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
  create(obj: any) {
    const item = this.items[obj.type];
    if (item) return new item(obj);
  }

  drop(coords: TCoord) {
    return this.randomItem(coords);
  }

  dropMultiple(coords: TCoord[]) {
    return coords.map(this.drop.bind(this));
  }

  possibleDrop(coords: TCoord) {
    return this.randomItem(coords);
  }

  randomItem(coords: TCoord) {
    // let dropItemKeys = Object.keys(this.dropItems),
    //   key: string = dropItemKeys[Math.floor(Math.random() * dropItemKeys.length)],
    //   val = Math.floor(Math.random() * this.dropItems[key].length);
    // let item = Object.assign({}, this.dropItems[key][val]);
    // item.x = x;
    // item.y = y;
    // return item;
  }
}

export default new MapElement();
