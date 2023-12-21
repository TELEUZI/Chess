import type { FigureColor, FigureTurn, MoveMessage } from '@chess/game-common';
import type { FieldState } from '@chess/game-engine';

export interface BestMoveParams {
  state: FieldState;
  color: FigureColor;
  availableMoves: FigureTurn[];
}

export interface Strategy {
  getBestMove: ({ state, color, availableMoves }: BestMoveParams) => MoveMessage | null;
}
