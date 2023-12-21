import type { FigureInfo } from '@chess/game-common';
import type { MoveMessage } from './move-message';

export interface TurnInfo {
  figure?: FigureInfo;
  move: MoveMessage;
  comment?: string;
}
