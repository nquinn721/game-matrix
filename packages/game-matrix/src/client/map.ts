import { MapElement } from "../game/MapElement";
import { Player } from "../game/Player";
import { mainPhysics } from "../game/matteritem";
import { Emitter } from "../game/Emitter";
import { IMap, IItem, IPlayer } from "../../types";

export class Map implements IMap {
  public w: number = 0;
  public h: number = 0;
  public items: IItem[] = [];
  public players: IPlayer[] = [];
  public player: IPlayer = new Player();
  public hasDestroyed: boolean = false;
  constructor() {
    // this.iniIPlayers(map.players);
    // this.setMainPlayer(id);
    // this.loadSegmentItems(map.items);
    // Emitter.on("destroy", obj => (this.hasDestroyed = true));
  }
  loop(cb?: Function) {
    this.players.forEach(v => v.loop());

    if (this.hasDestroyed) {
      this.players = this.players.filter(v => !v.destroyed);
      this.hasDestroyed = false;
    }
    mainPhysics.loop(this.player);
    cb && cb();
    setTimeout(this.loop.bind(this, cb), 10);
  }

  iniIPlayers(players: IPlayer[]) {
    this.players = players.map(p => {
      p = new Player(p, this);
      return p;
    });
  }

  loadPlayers(players: IPlayer[]) {
    players.forEach(this.addPlayer.bind(this));
  }

  addPlayer(player: IPlayer) {
    player = player instanceof Player ? player : new Player(player, this);
    this.players.push(player);
    Emitter.emit("update-player-graphics");
  }

  removePlayers(players: IPlayer[]) {
    players.forEach(this.removePlayer.bind(this));
    Emitter.emit("update-player-graphics");
  }
  removePlayer(player: IPlayer) {
    const p: IPlayer = this.geIPlayer(player);
    p.destroy(false);
    this.players = this.players.filter(v => v.id !== p.id);
  }

  updatePlayerInfo(obj: IPlayer) {
    let p = this.geIPlayer(obj.id);
    if (!p) return;
    p.setPosition({ x: obj.x, y: obj.y });
    p.setAngle(obj.angle);
    Object.assign(p, obj);
  }

  updatePlayerEvent(id: string, obj: { method: string }) {
    let p = this.geIPlayer(id);
    p && p[obj.method] && p[obj.method](obj);
  }

  setMainPlayer(id: string) {
    const p = this.players.find(v => v.id === id);
    if (p) this.player = p;
  }

  geIPlayer(id: { id: string } | string): IPlayer {
    id = id instanceof Object ? id.id : id;
    return this.players.find(v => v.id === id) || new Player();
  }
  createItem(obj: any) {
    let item = MapElement.create(obj);
    if (item) {
      this.items.push(item);
      item.initClient && item.initClient();
    }
  }
  destroyItem(id: IItem | string) {
    let item = typeof id === "object" ? id : this.getItemById(id);
    item && item.destroy();
    this.items = this.items.filter(v => !v.destroyed);
  }

  loadSegmentItems(items: IItem[]) {
    this.items = this.items
      .concat
      // items.map(v => {
      //   let item = MapElement.create(v);
      //   item.initClient && item.initClient(this);
      //   return item;
      // }),
      ();
  }
  updateItemsPos(items: IItem[]) {
    items.forEach(v => {
      let item = this.items.find(a => a.id === v.id);
      item && item.setPosition(v);
    });
  }
  removeSegmentItems(rowCols: any) {
    let items: IItem[] = rowCols
      .map((v: any) => this.items.filter(a => a.matrixSegment.row === v.row && a.matrixSegment.col === v.col))
      .flat();
    items.forEach(v => v.destroy(false));
    this.items = this.items.filter(v => !v.destroyed);
  }

  getItemById(id: string) {
    return this.items.find(v => v.id === id);
  }
}
