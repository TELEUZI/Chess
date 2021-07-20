import { Player } from '../components/pages/reg-page/start-page-view';
import FigureColor from '../enums/figure-colors';
import GameMode from '../enums/game-mode';
import { TimedMoveMessage } from './move-message';

export default interface Replay {
  date: number;
  history: TimedMoveMessage[];
  mode: GameMode;
  players: Player[];
  result: GameResult;
  moves: number;
}
export type GameResult = 'draw' | FigureColor;
