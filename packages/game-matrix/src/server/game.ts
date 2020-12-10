import { TGameConfig, TPlayer } from "game-matrix/types";
import { Matrix } from "./Matrix";
import { Player } from "../game/Player";

export class Game {
  public players: TPlayer[] = [];
  public maxPlayers: number = 50;
  public player: TPlayer = new Player();
  public hasDestroyed: boolean = false;
  public matrix: Matrix;
  public firstPlayer: boolean = true;
  public id: number = 0;

  constructor(game: TGameConfig = {}) {
    this.matrix = new Matrix({ w: 500, h: 500, segmentSize: 100 }, this);
    Object.assign(this, game);
  }

  loop(cb: Function) {
    this.players.forEach((v: TPlayer) => v.loop());

    if (this.hasDestroyed) {
      this.players = this.players.filter(v => !v.destroyed);
      this.hasDestroyed = false;
    }
    cb && cb();
    setTimeout(this.loop.bind(this, cb), 10);
  }

  updatePlayerEvent(id: number, obj: any) {
    let p = this.getPlayer(id);
    p && p[obj.method] && p[obj.method](obj);
  }

  removePlayer(player: TPlayer) {
    let p = this.getPlayer(player);
    if (p) {
      p.destroy(false);
      this.players = this.players.filter(v => p && v.id !== p.id);
      this.matrix.removePlayerFromSegment(p);
    }
  }

  createPlayer() {
    let player = new Player(
      {
        id: this.players.length + "-player",
        x: Math.round(Math.random() * (this.matrix.w - 100) + 50),
        y: Math.round(Math.random() * (this.matrix.h - 100) + 50),
        // x: 50,
        // y: 60,
        gameId: this.id,
      },
      {},
    );

    if (!this.firstPlayer) this.firstPlayer = true;

    this.matrix.addPlayerToSegment(player);

    this.players.push(player);
    return player;
  }

  destroy(obj: any) {
    if (obj.type === "player") {
      let player = this.getPlayer(obj);
      if (player) {
        player.destroy();
        this.matrix.removePlayerFromSegment(player);
        this.players = this.players.filter(v => player && v.id !== player.id);
      }
    } else this.matrix.destroyItem(obj);
  }
  create(obj: any) {
    this.matrix.addItem(obj, true);
  }

  getPlayer(id: any) {
    id = id instanceof Object ? id.id : id;
    return this.players.find(v => v.id === id);
  }

  isFull() {
    return this.players.length === this.maxPlayers;
  }

  getPlainListOfPlayersFromId(ids: any[]) {
    return ids.map(this.getPlayer.bind(this)).map((v: any) => v.plain());
  }

  plain() {
    return {
      players: this.players.map(v => v.plain()),
      rows: this.matrix.rows,
      cols: this.matrix.cols,
      segmentSize: this.matrix.segmentSize,
      w: this.matrix.w,
      h: this.matrix.h,
    };
  }
}

export default Game;
