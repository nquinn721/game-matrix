export type TCoords = {
  x: number;
  y: number;
};
export type TCoordsExt = {
  x: number;
  y: number;
  x1: number;
  y1: number;
};
export type TGame = {
  id: number;
  getPlainListOfPlayersFromId: Function;
  getPlayer: Function;
};
export type TGameConfig = {};
export type TMatrixconfig = {
  game: TGame;
  w: string | number;
  h: string | number;
  segmentSize: string | number;
};
export type TItem = {
  matrixSegment: number;
  body: any;
};
export type TPlayer = {
  id: number;
  x: number;
  y: number;
  gameId: number;
  matrixSegment: TSegment;
  getPosition(): any;
  loop(): null;
  body: any;
  destroyed: boolean;
  [key: string]: any;
};

export type TMatrix = {};

export type TSegment = {
  id: number;
  endx: number;
  endy: number;
  x: number;
  y: number;
  row: number;
  col: number;
  loadItems: Function;
  unloadItems(): TItem[];
  addInhabitedPlayer(id: number): TPlayer;
  removeInhabitedPlayer: Function;
  getTrackedItems: Function;
};
export type TSegmentArea = {
  addInhabitedPlayer: Function;
  getPlainPlayers: Function;
  removeInhabitedPlayer: Function;
  findSegment: Function;
  getPlainItems: Function;
  loadItems: Function;
  segments: TSegment[];
};
