import type { Coordinate } from '@coordinate';
import type { GameStatus, FigureColor, GameAction } from '@chess/game-common';
import type { PlayerSerializable } from '../player';

export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: FigureColor;
  fieldState?: string;
  players: PlayerSerializable[];
  lastMove?: MoveMessage;
}

export interface GameExternalInfo {
  gameStatus: GameStatus;
  playerCount: number;
}

export interface MoveMessage {
  from: Coordinate;
  to: Coordinate;
}

export interface ColorMessage {
  color: FigureColor;
}

export interface WsMessage {
  action: GameAction;
  payload?: ColorMessage | DrawResult | GameInfo;
}

export interface DrawResult {
  isDraw: boolean;
}
