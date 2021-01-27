import { Emitter } from "../game/Emitter";
import { MatrixArea } from "./MatrixArea";
import { MatrixSegment } from "./MatrixSegment";
import { Logger } from "../game/Logger";
import { TGame, IItem, TMatrixconfig, IPlayer, IMatrixArea, IMatrixSegment } from "game-matrix/types";

export class Matrix {
  public grid: any[] = [];
  public w: number = 0;
  public h: number = 0;
  public rows: number = 0;
  public cols: number = 0;
  public totalItems: number = 0;
  public segmentSize: number = 0;
  public segments: IMatrixArea[] = [];

  constructor(matrixConfig: TMatrixconfig, public game: TGame) {
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
        this.grid[row].push(new MatrixSegment(this.segmentSize, row, col));
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

  getSegmentArea(obj: any): IMatrixArea | undefined {
    obj = typeof obj === "object" ? obj : { x: obj, y: arguments[1] };
    let area = [],
      segment = this.getSegment(obj);

    if (!segment) return;

    for (let row = segment.row - 1; row <= segment.row + 1; row++)
      for (let col = segment.col - 1; col <= segment.col + 1; col++) area.push(this.getSegment({ row, col }));

    return new MatrixArea(area.filter(v => v));
  }

  // If player passed it will return all players except
  getSegmentAreaPlayers(obj: any, player: any) {
    let segmentArea = this.getSegmentArea(obj);
    if (segmentArea) return segmentArea.getPlainPlayers(player);
  }

  //TODO:: update to emit bulk
  addBulk(items: any, emitToArea: any) {
    items.forEach((v: IItem) => this.addItem(v, emitToArea));
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

  destroyItem(obj: IItem) {
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

  addPlayerToSegment(player: IPlayer) {
    let segment = this.getSegment(player.matrixSegment || player.getPosition()),
      area = this.getSegmentArea(segment);

    if (segment && area) {
      segment.addPlayer(player.id);
      player.matrixSegment = segment.plain();
    }
  }

  removePlayerFromSegment(player: IPlayer) {
    let segment = this.getSegment(player.matrixSegment),
      area = this.getSegmentArea(segment);
    if (segment && area) {
      segment.removePlayer(player.id);
    }
  }

  getNewPlayerSegments(player: IPlayer) {
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
        newSegmentArea: new MatrixArea(newArea.segments.filter((v: IMatrixSegment) => area && !area.findSegment(v.id))),
        oldSegmentArea: new MatrixArea(
          area.segments.filter((v: IMatrixSegment) => newArea && !newArea.findSegment(v.id)),
        ),
      };
    } else return {};
  }

  movePlayerSegment(player: IPlayer) {
    let { newSegmentArea, oldSegmentArea } = this.getNewPlayerSegments(player);
    if (newSegmentArea) {
      Emitter.emit("load-segment", player.id, newSegmentArea.getPlainItems());
      this.sendSegmenIPlayersToClient(player, newSegmentArea);
    }

    if (oldSegmentArea) {
      Emitter.emit("remove-segment", player.id, oldSegmentArea.getRowCols());
      this.removeSegmenIPlayersFromClient(player, oldSegmentArea);
    }
  }
  /**
   * Sends all other players in segment area to player client
   * @param player
   * @param segmentArea
   */
  sendSegmenIPlayersToClient(player: IPlayer, segmentArea: IMatrixArea) {
    let ids = segmentArea.getPlainPlayers(player);
    let players = ids.map(this.game.geIPlayer.bind(this.game)).map((v: any) => v.plain());
    Emitter.emit("load-segment-players", player, players);
  }
  /**
   * Clears old segment players from client
   * @param player
   * @param segmentArea
   */
  removeSegmenIPlayersFromClient(player: IPlayer, segmentArea: IMatrixArea) {
    let ids = segmentArea.getPlainPlayers(player);
    let players = this.game.getPlainListOfPlayersFromId(ids);
    Emitter.emit("remove-segment-players", player, players);
  }

  getInitialPlayerData(player: IPlayer): { items: IItem[]; players: IPlayer[] } {
    let segmentArea = this.getSegmentArea(player);
    let items: IItem[] = [];
    let players: IPlayer[] = [];
    if (segmentArea) {
      let items = segmentArea.getPlainItems(),
        ids = segmentArea.getPlainPlayers(),
        players = this.game.getPlainListOfPlayersFromId(ids);

      this.sendSegmenIPlayersToClient(player, segmentArea);
    }
    return { items, players };
  }

  plain() {
    return {
      w: this.w,
      h: this.h,
      rows: this.rows,
      cols: this.cols,
      segmentSize: this.segmentSize,
      grid: this.grid.map(v =>
        v.map((a: any) => ({
          items: a.getPlainItems(),
          players: a.getPlainPlayers(),
          playersInhabited: a.playersInhabited,
        })),
      ),
    };
  }
}
