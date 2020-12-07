import Collision from "./collision.mjs";
import { physics } from "../../game/matteritem.mjs";
import mapElement from "../../game/mapElements/mapElement.mjs";

class MatrixSegment extends Collision {
  constructor(segmentSize, row, col, x, y) {
    super();
    this.x = col > 0 ? x + 1 : x;
    this.y = row > 0 ? y + 1 : y;
    this.endx = x + segmentSize;
    this.endy = y + segmentSize;
    this.w = segmentSize;
    this.h = segmentSize;
    this.col = col;
    this.row = row;
    this.id = `grid-row-${row}-col-${col}`;
    this.items = [];
    this.players = [];
    this.playersInhabited = [];
    this.isLoaded = false;
  }

  addItem(obj) {
    obj.id = `${obj.type}-${this.row}-${this.col}-${this.items.length}`;
    obj.matrixSegment = { row: this.row, col: this.col };
    if (this.loaded) {
      obj = mapElement.create(obj);
      obj.load && obj.load();
    }
    this.items.push(obj);
  }

  hasItem(obj) {
    return (
      this.x <= obj.x &&
      this.endx >= obj.x &&
      this.y <= obj.y &&
      this.endy >= obj.y
    );
  }

  loadItems() {
    if (!this.loaded) {
      this.loaded = true;
      this.items = this.items.map(mapElement.create.bind(mapElement));
    }
  }

  unloadItems() {
    if (!this.playersInhabited.length) {
      this.loaded = false;
      this.items.forEach(physics.destroyItem);
      this.items = this.items.map(v => v.plain());
    }
  }
  addPlayer(id) {
    this.players.push(id);
  }

  getItem(id) {
    id = typeof id === "string" ? id : id.id;
    return this.items.find(v => v.id === id);
  }

  destroyItem(id) {
    id = typeof id === "string" ? id : id.id;
    this.items = this.items.filter(v => v.id !== id);
  }

  getTrackedItems() {
    return this.items.filter(v => v.positionalTracking).map(v => v.plain());
  }

  addInhabitedPlayer(id) {
    this.playersInhabited.push(id);
  }

  removeInhabitedPlayer(id) {
    this.playersInhabited = this.playersInhabited.filter(v => v !== id);
  }

  removePlayer(id) {
    id = typeof id === "string" ? id : id.id;
    this.players = this.players.filter(v => v !== id);
  }

  getPlainItems() {
    return this.items.map(v => (v && v.plain ? v.plain() : v));
  }

  getPlainPlayers(player) {
    if (player) return this.players.filter(v => v !== player.id);
    return this.players;
  }

  getAllPlayers() {
    return this.players.concat(this.playersInhabited);
  }
  spotIsTaken(obj) {
    return !!this.items.filter(p => this.collides(p, obj) && {}).length;
  }

  plain() {
    return {
      x: this.x,
      y: this.y,
      endx: this.endx,
      endy: this.endy,
      col: this.col,
      row: this.row
    };
  }
}

export default MatrixSegment;
