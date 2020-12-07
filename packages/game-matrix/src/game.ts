import { mainPhysics } from "./matteritem";
import { TGameConfig, TMatrix, TPlayer } from ".";
import Matrix from "./matrix";
import Player from "./player";

export class Game {
  public players: TPlayer[] = [];
  public maxPlayers: number = 50;
  public player = {};
  public hasDestroyed: boolean = false;
  public matrix: any;
  public firstPlayer: boolean = true;
  public id: number = 0;

  constructor(game: TGameConfig) {
    this.matrix = new Matrix({ game: this, w: 10000, h: 10000, segmentSize: 1000 });
    Object.assign(this, game);
  }

  loop(cb: Function) {
    this.players.forEach((v: TPlayer) => v.loop());

    if (this.hasDestroyed) {
      this.players = this.players.filter((v) => !v.destroyed);
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
      this.players = this.players.filter((v) => v.id !== p.id);
      this.matrix.removePlayerFromSegment(p);
    }
  }

  createPlayer(id: number) {
    let player = new Player({
      id,
      // x: Math.round(Math.random() * (this.matrix.w - 100) + 50),
      x: this.firstPlayer ? 605 : 60,
      // y: Math.round(Math.random() * (this.matrix.h - 100) + 50),
      gameId: this.id,
      y: 60,
    });

    if (!this.firstPlayer) this.firstPlayer = true;

    this.matrix.addPlayerToSegment(player);

    this.players.push(player);
    return player;
  }

  destroy(obj: any) {
    if (obj.type === "player") {
      let player = this.getPlayer(obj);
      player.destroy();
      this.matrix.removePlayerFromSegment(player);
      this.players = this.players.filter((v) => v.id !== player.id);
    } else this.matrix.destroyItem(obj);
  }
  create(obj: any) {
    this.matrix.addItem(obj, true);
  }

  getPlayer(id: any) {
    id = id instanceof Object ? id.id : id;
    return this.players.find((v) => v.id === id);
  }

  isFull() {
    return this.players.length === this.maxPlayers;
  }

  getPlainListOfPlayersFromId(ids: any[]) {
    return ids.map(this.getPlayer.bind(this)).map((v) => v.plain());
  }

  plain(player: TPlayer) {
    let { players, items } = this.matrix.getInitialPlayerData(player);
    return {
      players,
      matrisSegmentSize: this.matrix.segmentSize,
      w: this.matrix.w,
      h: this.matrix.h,
      items,
    };
  }
}

export default Game;
