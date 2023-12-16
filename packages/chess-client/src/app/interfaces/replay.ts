import type { FigureColor, IPlayer } from '@chess/game-common';
import type GameMode from '../enums/game-mode';
import type { TimedMoveMessage } from './move-message';

export default interface Replay {
  date: number;
  history: TimedMoveMessage[];
  mode: GameMode;
  players: (IPlayer & { avatar: string })[];
  result: GameResult | null;
  moves: number;
}
export type GameResult = FigureColor | 'draw';
