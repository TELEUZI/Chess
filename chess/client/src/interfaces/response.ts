import FigureColor from '../enums/figure-colors';
import { GameAction, GameStatus } from '../enums/game-status-action';
import MoveMessage from './move-message';

export interface GameMessage {
  action: GameAction;
  payload: GameInfo | ColorMessage | DrawResult;
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

export type PlayerSerializable = Record<string, string | null | boolean | string[] | FigureColor>;

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
