import type FieldState from '@client/app/pages/game-page/chess-game/state/field-state';
import type { FigureColor } from '@chess/game-common';
import type { FigureTurn } from './move-message';
import type MoveMessage from './move-message';

export interface BestMoveParams {
  state: FieldState;
  color: FigureColor;
  availableMoves: FigureTurn[];
}

export interface Strategy {
  getBestMove: ({ state, color, availableMoves }: BestMoveParams) => MoveMessage | null;
}
