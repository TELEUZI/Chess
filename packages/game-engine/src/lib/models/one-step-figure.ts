import type { Pawn, FieldState } from '@chess/game-engine';

export const isEnemyOnDiagonal = (
  state: FieldState,
  pawn: Pawn,
  posX: number,
  posY: number,
): boolean => {
  const cell = state.getCellAt(posX, posY);
  return !!(cell?.getFigure() && state.getFigureColor(posX, posY) !== pawn.getColor());
};

export const isRightMove = (state: FieldState, posX: number, posY: number): boolean => {
  const cell = state.getCellAt(posX, posY);
  return !!(cell && !cell.getFigure());
};
