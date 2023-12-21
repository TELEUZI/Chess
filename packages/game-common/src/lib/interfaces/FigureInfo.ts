import type { FigureColor, FigureType } from '@chess/game-common';

export interface FigureInfo {
  readonly type: FigureType | null;
  readonly color: FigureColor | null;
}
