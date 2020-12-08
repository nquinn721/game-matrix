import { TPlayer, TSegment } from "game-matrix/types";
import MatrixSegment from "./matrixSegment";

class MatrixArea {
  constructor(public segments: TSegment[]) {}

  getPlainItems() {
    // @ts-ignore
    return this.segments.map((v) => v.getPlainItems()).flat();
  }

  getPlainPlayers(player: TPlayer) {
    // @ts-ignore
    return this.segments.map((v: TSegment) => v.getPlainPlayers(player)).flat();
  }

  getTrackedItems() {
    // @ts-ignore
    return this.segments.map((v: TSegment) => v.getTrackedItems()).flat();
  }

  loadItems() {
    this.segments.forEach((v: TSegment) => v.loadItems());
  }

  unloadItems() {
    this.segments.forEach((v) => v.unloadItems());
  }

  addInhabitedPlayer(id: number, segment: TSegment) {
    this.segments.forEach((v: TSegment) => v.id !== segment.id && v.addInhabitedPlayer(id));
  }
  removeInhabitedPlayer(id: number) {
    this.segments.forEach((v: TSegment) => v.removeInhabitedPlayer(id));
  }

  findSegment(id: any) {
    id = typeof id === "string" ? id : id.id;
    return this.segments.find((v) => v.id === id);
  }

  getRowCols() {
    return this.segments.map((v) => ({ row: v.row, col: v.col }));
  }
}

export default MatrixArea;
