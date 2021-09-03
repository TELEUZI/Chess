import { FigureInfo } from '../components/pages/game-page/chess-game/models/figures/figure-model';
import MoveMessage from './move-message';

export default interface TurnInfo {
  figure: FigureInfo;
  move: MoveMessage;
  comment?: string;
}
