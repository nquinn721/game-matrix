import { IPlayer, IMatrixArea, IMatrixSegment } from "game-matrix/types";

export class MatrixArea implements IMatrixArea {
  constructor(public segments: IMatrixSegment[]) {}
  getRowCols() {
    return this.segments.map(v => ({ row: v.row, col: v.col }));
  }
  findSegment(id: any) {
    id = typeof id === "string" ? id : id.id;
    return this.segments.find(v => v.id === id);
  }

  getPlainItems() {
    // @ts-ignore
    return this.segments.map(v => v.getPlainItems()).flat();
  }

  getPlainPlayers(player?: IPlayer) {
    // @ts-ignore
    return this.segments.map((v: IMatrixSegment) => v.getPlainPlayers(player)).flat();
  }

  getTrackedItems() {
    // @ts-ignore
    return this.segments.map((v: IMatrixSegment) => v.getTrackedItems()).flat();
  }
}
