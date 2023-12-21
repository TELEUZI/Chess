import type { FigureColor, GameMode, IPlayer } from '@chess/game-common';
import type { TimedMoveMessage } from './move-message';

export interface Replay {
  date: number;
  history: TimedMoveMessage[];
  mode: GameMode;
  players: (IPlayer & { avatar: string })[];
  result: GameResult | null;
  moves: number;
}
export type GameResult = FigureColor | 'draw';
