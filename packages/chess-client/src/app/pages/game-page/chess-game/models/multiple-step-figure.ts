import type FieldState from '../state/field-state';
import type FigureModel from './figures/figure-model';

export const isRightMove = (
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
