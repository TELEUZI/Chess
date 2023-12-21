import type { GameStatus, GameAction, MoveMessage } from '@chess/game-common';
import type { PlayerSerializable, FigureColor } from '../player';

export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: FigureColor;
  fieldState: string;
  players: PlayerSerializable[];
  lastMove: MoveMessage;
}

export interface GameExternalInfo {
  gameStatus: GameStatus;
  playerCount: number;
}

export interface ColorMessage {
  color: FigureColor;
}

export type WsMessage =
  | DisconnectMessage
  | DrawMessage
  | DrawResponseMessage
  | MoveFigureMessage
  | SetUserColorMessage
  | StartGameMessage;

export interface StartGameMessage {
  action: GameAction.startGame;
  payload: GameInfo;
}

export interface MoveFigureMessage {
  action: GameAction.moveFigure;
  payload: GameInfo;
}

export interface DrawMessage {
  action: GameAction.drawSuggest;
  payload: null;
}

export interface DrawResponseMessage {
  action: GameAction.drawResponse;
  payload: DrawResult;
}

export interface DisconnectMessage {
  action: GameAction.disconnect;
  payload: GameInfo;
}

export interface SetUserColorMessage {
  action: GameAction.setUserColor;
  payload: ColorMessage;
}

export interface DrawResult {
  isDraw: boolean;
}
