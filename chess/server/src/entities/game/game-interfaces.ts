import { PlayerColor } from '../player/player-enums';
import { PlayerSerializable } from '../player/player-interfaces';
import { GameStatus } from './game-enums';

export interface GameInfo {
  gameStatus: GameStatus;
  currentPlayerColor: PlayerColor;
  fieldState: string;
  players: PlayerSerializable[];
  lastMove: MoveMessage;
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
class Coordinate {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  equals(coordinate: Coordinate): boolean {
    return this.x === coordinate.x && this.y === coordinate.y;
  }
}

export default Coordinate;
