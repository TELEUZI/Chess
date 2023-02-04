import type FigureColor from '../enums/figure-colors';
import type { GameAction, GameStatus } from '../enums/game-status-action';
import type MoveMessage from './move-message';

export interface GameMessage {
  action: GameAction;
  payload: ColorMessage | DrawResult | GameInfo;
}
export interface ColorMessage {
  color: FigureColor;
}
export interface DrawResult {
  isDraw: boolean;
}
export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: FigureColor;
  fieldState: string;
  players: Player[];
  lastMove: MoveMessage;
}
export interface GameExternalInfo {
  gameStatus: GameStatus;
  playerCount: number;
}

export interface GamePlayers {
  players: PlayerSerializable[];
}

export interface Player {
  name: string;
  color: FigureColor;
  avatar: string;
}

export type PlayerSerializable = Record<string, FigureColor | string[] | boolean | string | null>;

export enum PlayerState {
  joined,
  ready,
  playing,
  disconnected,
  victor,
}

export interface Room {
  clients: Map<string, WebSocket>;
  game: GameExternalInfo;
}
export interface PlayerAddResponse {
  playerInfo: PlayerSerializable;
  playerToken?: string;
}

export interface RoomCreateResponse {
  roomCreated: boolean;
  creator: PlayerAddResponse;
  failureReason?: string;
}
