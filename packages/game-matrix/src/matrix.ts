import mapElement from "./mapElement";
import { Emitter } from "./Emitter";
import MatrixArea from "./matrixArea";
import MatrixSegment from "./matrixSegment";
import { Logger } from "./Logger";
import { TGame, TItem, TMatrixconfig, TPlayer, TSegmentArea } from "game-matrix/types";
class Game {
  id: number = 0;
  getPlainListOfPlayersFromId() {}
  getPlayer() {}
}

class Matrix {
  public grid: any[] = [];
  public game: TGame = new Game();
  public w: number = 0;
  public h: number = 0;
  public rows: number = 0;
  public cols: number = 0;
  public totalItems: number = 0;
  public segmentSize: number = 0;
  public segments: TSegmentArea[] = [];

  constructor(matrixConfig: TMatrixconfig) {
    Object.assign(this, matrixConfig);
    this.rows = this.h / this.segmentSize;
    this.cols = this.w / this.segmentSize;

    Logger.log("loading matrix");
    this.buildGrid();
    Logger.log("done loading matrix row:", this.rows, " cols:", this.cols);
  }

  buildGrid() {
    let col = 0,
      row = 0;
    for (let i = 0; i < this.h; i += this.segmentSize) {
      this.grid.push([]);
      for (let j = 0; j < this.w; j += this.segmentSize) {
        this.grid[row].push(new MatrixSegment(this.segmentSize, row, col, j, i));
        col++;
      }
      col = 0;
      row++;
    }
  }

  getSegment(obj: any) {
    obj = typeof obj === "object" ? obj : { x: obj, y: arguments[1] };

    let row = obj.row,
      col = obj.col;

    if (typeof row === "undefined") {
      (row = Math.floor(obj.y / this.segmentSize)), (col = Math.floor(obj.x / this.segmentSize));
    }
    return this.grid[row] && this.grid[row][col];
  }

  getSegmentArea(obj: any): TSegmentArea | undefined {
    obj = typeof obj === "object" ? obj : { x: obj, y: arguments[1] };
    let area = [],
      segment = this.getSegment(obj);

    if (!segment) return;

    for (let row = segment.row - 1; row <= segment.row + 1; row++)
      for (let col = segment.col - 1; col <= segment.col + 1; col++) area.push(this.getSegment({ row, col }));

    return new MatrixArea(area.filter((v) => v));
  }

  // If player passed it will return all players except
  getSegmentAreaPlayers(obj: any, player: any) {
    let segmentArea = this.getSegmentArea(obj);
    if (segmentArea) return segmentArea.getPlainPlayers(player);
  }

  //TODO:: update to emit bulk
  addBulk(items: any, emitToArea: any) {
    items.forEach((v: TItem) => this.addItem(v, emitToArea));
  }

  addItem(obj: any, emitToArea: any) {
    if (!obj) return;
    let segment = this.getSegment(obj);

    obj.gameId = this.game.id;
    if (segment) {
      segment.addItem(obj);
      this.totalItems++;
      if (emitToArea) {
        let players = segment.getAllPlayers();
        Emitter.emit("load-item-segment-area", players, obj);
      }
    }
  }

  destroyItem(obj: TItem) {
    let segment = this.getSegment(obj.matrixSegment);
    if (segment) {
      segment.destroyItem(obj);
      this.totalItems--;
    }
  }

  getItemById(id: string) {
    let [type, row, col] = id.split("-"),
      segment = this.getSegment({ row, col });
    return segment.getItem(id);
  }

  addPlayerToSegment(player: TPlayer) {
    let segment = this.getSegment(player.matrixSegment || player.getPosition()),
      area = this.getSegmentArea(segment);

    if (segment && area) {
      segment.addPlayer(player.id);
      area.addInhabitedPlayer(player.id, segment);
      player.matrixSegment = segment.plain();
    }
  }

  removePlayerFromSegment(player: TPlayer) {
    let segment = this.getSegment(player.matrixSegment),
      area = this.getSegmentArea(segment);
    if (segment && area) {
      segment.removePlayer(player.id);
      area.removeInhabitedPlayer(player.id);
    }
  }

  getNewPlayerSegments(player: TPlayer) {
    let area = this.getSegmentArea(player.matrixSegment),
      pos = player.getPosition();

    this.removePlayerFromSegment(player);
    if (pos.x > player.matrixSegment.endx) player.matrixSegment.col++;
    if (pos.x < player.matrixSegment.x) player.matrixSegment.col--;
    if (pos.y < player.matrixSegment.y) player.matrixSegment.row--;
    if (pos.y > player.matrixSegment.endy) player.matrixSegment.row++;
    this.addPlayerToSegment(player);

    let newArea = this.getSegmentArea(player.matrixSegment);

    if (area && newArea) {
      return {
        newSegmentArea: new MatrixArea(newArea.segments.filter((v) => area && !area.findSegment(v.id))),
        oldSegmentArea: new MatrixArea(area.segments.filter((v) => newArea && !newArea.findSegment(v.id))),
      };
    } else return {};
  }

  movePlayerSegment(player: TPlayer) {
    let { newSegmentArea, oldSegmentArea } = this.getNewPlayerSegments(player);
    if (newSegmentArea) {
      newSegmentArea.loadItems();
      Emitter.emit("load-segment", player.id, newSegmentArea.getPlainItems());
      this.sendSegmentPlayersToClient(player, newSegmentArea);
    }

    if (oldSegmentArea) {
      oldSegmentArea.unloadItems();
      Emitter.emit("remove-segment", player.id, oldSegmentArea.getRowCols());
      this.removeSegmentPlayersFromClient(player, oldSegmentArea);
    }
  }
  /**
   * Sends all other players in segment area to player client
   * @param player
   * @param segmentArea
   */
  sendSegmentPlayersToClient(player: TPlayer, segmentArea: TSegmentArea) {
    let ids = segmentArea.getPlainPlayers(player);
    let players = ids.map(this.game.getPlayer.bind(this.game)).map((v: any) => v.plain());
    Emitter.emit("load-segment-players", player, players);
  }
  /**
   * Clears old segment players from client
   * @param player
   * @param segmentArea
   */
  removeSegmentPlayersFromClient(player: TPlayer, segmentArea: TSegmentArea) {
    let ids = segmentArea.getPlainPlayers(player);
    let players = this.game.getPlainListOfPlayersFromId(ids);
    Emitter.emit("remove-segment-players", player, players);
  }

  getInitialPlayerData(player: TPlayer) {
    let segmentArea = this.getSegmentArea(player);
    if (segmentArea) {
      let items = segmentArea.getPlainItems(),
        ids = segmentArea.getPlainPlayers(),
        players = this.game.getPlainListOfPlayersFromId(ids);

      segmentArea.loadItems();
      this.sendSegmentPlayersToClient(player, segmentArea);

      return { items, players };
    }
  }

  plain() {
    return {
      w: this.w,
      h: this.h,
      rows: this.rows,
      cols: this.cols,
      segmentSize: this.segmentSize,
      grid: this.grid.map((v) =>
        v.map((a: any) => ({
          items: a.getPlainItems(),
          players: a.getPlainPlayers(),
          playersInhabited: a.playersInhabited,
        })),
      ),
    };
  }
}

export default Matrix;
