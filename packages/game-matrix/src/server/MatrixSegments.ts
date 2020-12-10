import { MapElement } from "../game/MapElement";
import { IMatrixSegment, TPlayer, IItem } from "game-matrix/types";

export class MatrixSegment implements IMatrixSegment {
  public items: IItem[] = [];
  public players: TPlayer[] = [];
  public x: number = 0;
  public y: number = 0;
  public endx: number = 0;
  public endy: number = 0;
  public w: number = 0;
  public h: number = 0;
  public id: string = "";
  public loaded: boolean = false;

  constructor(segmentSize: any, public row: number, public col: number) {
    const x = col * segmentSize;
    const y = row * segmentSize;
    this.x = col > 0 ? x + 1 : x;
    this.y = row > 0 ? y + 1 : y;
    this.endx = x + segmentSize;
    this.endy = y + segmentSize;
    this.w = segmentSize;
    this.h = segmentSize;
    this.id = `grid-row-${row}-col-${col}`;
  }

  addItem(obj: { type: string }) {
    const item = MapElement.create({
      id: `${obj.type}-${this.row}-${this.col}-${this.items.length}`,
      matrixSegment: { row: this.row, col: this.col },
      ...obj,
    });
    item && this.items.push(item);
  }

  hasItem(obj: IItem): boolean {
    return !!this.items.find(v => v.id === obj.id);
  }

  getItem(id: string | IItem): IItem | undefined {
    id = typeof id === "string" ? id : id.id;
    return this.items.find(v => v.id === id);
  }

  destroyItem(id: string | IItem) {
    id = typeof id === "string" ? id : id.id;
    this.items = this.items.filter(v => v.id !== id);
  }

  getTrackedItems() {
    return this.items.filter(v => v.positionalTracking).map(v => v.plain());
  }

  addPlayer(id: any) {
    this.players.push(id);
  }

  removePlayer(id: any) {
    id = typeof id === "string" ? id : id.id;
    this.players = this.players.filter(v => v !== id);
  }

  getPlainItems() {
    return this.items.map(v => (v && v.plain ? v.plain() : v));
  }

  getPlainPlayers(player: TPlayer) {
    if (player) return this.players.filter(v => v.id !== player.id);
    return this.players;
  }

  getAllPlayers() {
    return this.players.concat(this.players);
  }

  plain() {
    return {
      x: this.x,
      y: this.y,
      endx: this.endx,
      endy: this.endy,
      col: this.col,
      row: this.row,
    };
  }
}
