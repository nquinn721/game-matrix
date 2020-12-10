import { mapElement } from "../game/mapElement";
import { Player } from "../game/player";
import { mainPhysics } from "../game/matteritem";
import { Emitter } from "../game/Emitter";
import { IMap, TItem, TPlayer } from "../../types";

export class Map implements IMap {
  public w: number = 0;
  public h: number = 0;
  public items: TItem[] = [];
  public players: TPlayer[] = [];
  public player: TPlayer = new Player();
  public hasDestroyed: boolean = false;
  constructor() {
    // this.initPlayers(map.players);
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

  initPlayers(players: TPlayer[]) {
    this.players = players.map(p => {
      p = new Player(p, this);
      return p;
    });
  }

  loadPlayers(players: TPlayer[]) {
    players.forEach(this.addPlayer.bind(this));
  }

  addPlayer(player: TPlayer) {
    player = player instanceof Player ? player : new Player(player, this);
    this.players.push(player);
    Emitter.emit("update-player-graphics");
  }

  removePlayers(players: TPlayer[]) {
    players.forEach(this.removePlayer.bind(this));
    Emitter.emit("update-player-graphics");
  }
  removePlayer(player: TPlayer) {
    const p: TPlayer = this.getPlayer(player);
    p.destroy(false);
    this.players = this.players.filter(v => v.id !== p.id);
  }

  updatePlayerInfo(obj: TPlayer) {
    let p = this.getPlayer(obj.id);
    if (!p) return;
    p.setPosition({ x: obj.x, y: obj.y });
    p.setAngle(obj.angle);
    Object.assign(p, obj);
  }

  updatePlayerEvent(id: string, obj: { method: string }) {
    let p = this.getPlayer(id);
    p && p[obj.method] && p[obj.method](obj);
  }

  setMainPlayer(id: string) {
    const p = this.players.find(v => v.id === id);
    if (p) this.player = p;
  }

  getPlayer(id: { id: string } | string): TPlayer {
    id = id instanceof Object ? id.id : id;
    return this.players.find(v => v.id === id) || new Player();
  }
  createItem(obj: any) {
    let item = mapElement.create(obj);
    this.items.push(item);
    item.initClient && item.initClient(this);
  }
  destroyItem(id: TItem | string) {
    let item = typeof id === "object" ? id : this.getItemById(id);
    item && item.destroy();
    this.items = this.items.filter(v => !v.destroyed);
  }

  loadSegmentItems(items: TItem[]) {
    this.items = this.items.concat(
      items.map(v => {
        let item = mapElement.create(v);
        item.initClient && item.initClient(this);
        return item;
      }),
    );
  }
  updateItemsPos(items: TItem[]) {
    items.forEach(v => {
      let item = this.items.find(a => a.id === v.id);
      item && item.setPosition(v);
    });
  }
  removeSegmentItems(rowCols: any) {
    let items: TItem[] = rowCols
      .map((v: any) => this.items.filter(a => a.matrixSegment.row === v.row && a.matrixSegment.col === v.col))
      .flat();
    items.forEach(v => v.destroy(false));
    this.items = this.items.filter(v => !v.destroyed);
  }

  getItemById(id: string) {
    return this.items.find(v => v.id === id);
  }
}
