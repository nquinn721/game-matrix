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
  geIPlayer: Function;
};
export type TGameConfig = {};
export type TMatrixconfig = {
  w: string | number;
  h: string | number;
  segmentSize: string | number;
};
export interface IItem {
  id: string;
  type: string;
  matrixSegment: any;
  body: any;
  x: number;
  y: number;
  positionalTracking: boolean;
  destroyed: boolean;
  setPosition(coords: TCoords): void;
  initClient(): void;
  plain(): any;
  destroy(emit?: boolean): void;
}
export type TItemMatrixSegment = {
  row: number;
  col: number;
};
export interface IPlayer {
  id: string;
  x: number;
  y: number;
  gameId: number;
  matrixSegment: IMatrixSegment;
  getPosition(): any;
  loop(): any;
  body: any;
  destroyed: boolean;
  [key: string]: any;
}

export type TMatrix = {};

export interface IMap {
  w: number;
  h: number;
  items: IItem[];
  players: IPlayer[];
  player: IPlayer;
  hasDestroyed: boolean;
  loop(cb?: Function): void;
  iniIPlayers(players: IPlayer[]): void;
  loadPlayers(players: IPlayer[]): void;
  addPlayer(player: IPlayer): void;
  removePlayers(players: IPlayer[]): void;
  removePlayer(player: IPlayer): void;
  updatePlayerInfo(obj: IPlayer): void;
  updatePlayerEvent(id: string, obj: { method: string }): void;
  setMainPlayer(id: string): void;
  geIPlayer(id: { id: string } | string): IPlayer;
  createItem(obj: any): void;
  destroyItem(id: IItem | string): void;
  loadSegmentItems(items: IItem[]): void;
  updateItemsPos(items: IItem[]): void;
  removeSegmentItems(rowCols: any): void;
  getItemById(id: string): IItem | void;
}

export interface IMatrixSegment {
  items: IItem[];
  players: IPlayer[];
  row: number;
  col: number;
  x: number;
  y: number;
  endx: number;
  endy: number;
  w: number;
  h: number;
  id: string;
  loaded: boolean;
  addItem(obj: any): void;
  addPlayer(id: any): void;
  hasItem(obj: string | IItem): boolean;
  getItem(id: string | IItem): IItem | undefined;
  destroyItem(id: string | IItem): void;
  getTrackedItems(): IItem[];
  removePlayer(id: any): void;
  getPlainItems(): IItem[];
  getPlainPlayers(player?: IPlayer): IPlayer[];
  getAllPlayers(): IPlayer[];
  plain(): {
    x: number;
    y: number;
    endx: number;
    endy: number;
    col: number;
    row: number;
  };
}

export interface IMatrixArea {
  getPlainPlayers(player?: IPlayer): IPlayer[];
  getPlainItems(): IItem[];
  segments: IMatrixSegment[];
  findSegment(id: any): any;
  getRowCols(): any;
}
