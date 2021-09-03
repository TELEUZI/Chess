import FigureColor from '../enums/figure-colors';
import GameMode from '../enums/game-mode';
import { TimedMoveMessage } from './move-message';
import { Player } from './response';

export default interface Replay {
  date: number;
  history: TimedMoveMessage[];
  mode: GameMode;
  players: Player[];
  result: GameResult;
  moves: number;
}
export type GameResult = 'draw' | FigureColor;
