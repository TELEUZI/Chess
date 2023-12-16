import type { FigureInfo } from '@client/app/pages/game-page/chess-game/models/figures/figure-model';
import type MoveMessage from './move-message';

export default interface TurnInfo {
  figure?: FigureInfo;
  move: MoveMessage;
  comment?: string;
}
