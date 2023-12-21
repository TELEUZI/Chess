import type { FieldState, FigureModel } from '@chess/game-engine';

export const isMultipleStepRightMove = (
  state: FieldState,
  figure: FigureModel,
  posX: number,
  posY: number,
): boolean => {
  return !!(
    state.getCellAt(posX, posY) &&
    (state.getCellAt(posX, posY)?.getFigure() === null ||
      state.getFigureColor(posX, posY) !== figure.getColor())
  );
};
