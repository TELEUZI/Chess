import type FigureColor from '../enums/figure-colors';
import type GameMode from '../enums/game-mode';
import type { TimedMoveMessage } from './move-message';
import type { Player } from './response';

export default interface Replay {
  date: number;
  history: TimedMoveMessage[];
  mode: GameMode;
  players: Player[];
  result: GameResult | null;
  moves: number;
}
export type GameResult = FigureColor | 'draw';
