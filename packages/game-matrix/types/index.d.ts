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
export type TPlayer = {
  id: string;
  x: number;
  y: number;
  gameId: number;
  matrixSegment: TSegment;
  getPosition(): any;
  loop(): any;
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
  unloadItems(): IItem[];
  addInhabitedPlayer(id: number): TPlayer;
  removeInhabitedPlayer: Function;
  getTrackedItems: Function;
};
export type TSegmentArea = {
  addInhabitedPlayer: Function;
  getPlainPlayers: Function;
  removeInhabitedPlayer: Function;
  getPlainItems: Function;
  loadItems: Function;
  segments: TSegment[];
  findSegment(id: any): any;
};

export interface IMap {
  w: number;
  h: number;
  items: IItem[];
  players: TPlayer[];
  player: TPlayer;
  hasDestroyed: boolean;
  loop(cb?: Function): void;
  initPlayers(players: TPlayer[]): void;
  loadPlayers(players: TPlayer[]): void;
  addPlayer(player: TPlayer): void;
  removePlayers(players: TPlayer[]): void;
  removePlayer(player: TPlayer): void;
  updatePlayerInfo(obj: TPlayer): void;
  updatePlayerEvent(id: string, obj: { method: string }): void;
  setMainPlayer(id: string): void;
  getPlayer(id: { id: string } | string): TPlayer;
  createItem(obj: any): void;
  destroyItem(id: IItem | string): void;
  loadSegmentItems(items: IItem[]): void;
  updateItemsPos(items: IItem[]): void;
  removeSegmentItems(rowCols: any): void;
  getItemById(id: string): IItem | void;
}

export interface IMatrixSegment {
  items: IItem[];
  players: TPlayer[];
  x: number;
  y: number;
  endx: number;
  endy: number;
  w: number;
  h: number;
  id: string;
  loaded: boolean;
  addItem(obj: any): void;
  hasItem(obj: IItem): boolean;
  addPlayer(id: any): void;
  getItem(id: string | IItem): IItem | undefined;
  destroyItem(id: string | IItem): void;
  getTrackedItems(): IItem[];
  removePlayer(id: any): void;
  getPlainItems(): IItem[];
  getPlainPlayers(player: TPlayer): TPlayer[];
  getAllPlayers(): TPlayer[];
  plain(): {
    x: number;
    y: number;
    endx: number;
    endy: number;
    col: number;
    row: number;
  };
}
