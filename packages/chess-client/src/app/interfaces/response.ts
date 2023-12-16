import type { GameStatus, IPlayer, FigureColor, GameExternalInfo } from '@chess/game-common';
import type MoveMessage from './move-message';

export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: FigureColor;
  fieldState: string;
  players: IPlayer[];
  lastMove: MoveMessage;
}

export interface Room {
  clients: Map<string, WebSocket>;
  game: GameExternalInfo;
}
