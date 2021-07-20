import { PlayerColor } from '../player/player-enums';
import { PlayerSerializable } from '../player/player-interfaces';
import { GameStatus } from './game-enums';

export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: PlayerColor;
  fieldState: string;
  players: PlayerSerializable[];
}
export interface GameExternalInfo {
  gameStatus: GameStatus;
  playerCount: number;
}
export interface GamePlayers {
  players: PlayerSerializable[];
}
