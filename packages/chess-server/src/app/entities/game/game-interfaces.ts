import type { Coordinate } from '@coordinate';
import type { GameStatus } from '@chess/game-common';
import type { PlayerColor } from '../player/player-enums';
import type { PlayerSerializable } from '../player/player-interfaces';

export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: PlayerColor;
  fieldState?: string;
  players: PlayerSerializable[];
  lastMove?: MoveMessage;
}
export interface GameExternalInfo {
  gameStatus: GameStatus;
  playerCount: number;
}
export interface GamePlayers {
  players: PlayerSerializable[];
}
export interface MoveMessage {
  from: Coordinate;
  to: Coordinate;
}
export interface FigureTurn {
  from: Coordinate;
  to: Coordinate[];
}
