import { Coordinate } from '@chess/coordinate';
import FigureType from '@client/app/enums/figure-type';
import type { FigureColor } from '@chess/game-common';
import type CellModel from '../../models/cell-model';
import type FigureModel from '../../models/figures/figure-model';
import type FieldState from '../../state/field-state';
import { isInField } from '../../state/field-state';

export function forEachCell(
  state: FieldState,
  callback: (cell: CellModel, pos: Coordinate) => void,
): void {
  state.state.forEach((it, i) => {
    it.forEach((jt, j) => {
      callback(jt, new Coordinate(i, j));
    });
  });
}

export function getFigureFromState(
  fieldState: FieldState,
  fromX: number,
  fromY: number,
): FigureModel | null {
  return fieldState.getFigure(fromX, fromY);
}

export function exchangePositions(state: FieldState, from: Coordinate, to: Coordinate): void {
  const fromFigure = state.getFigure(from.x, from.y);
  if (fromFigure == null) {
    return;
  }
  const toFigure = state.getFigure(to.x, to.y);
  if (
    !isInField(to.x, to.y) ||
    (toFigure != null && toFigure.getColor() === fromFigure.getColor())
  ) {
    return;
  }
  state.getCellAt(to.x, to.y)?.setFigure(fromFigure);
  state.getCellAt(from.x, from.y)?.setFigure(null);
}
export function forEachPlayerFigure(
  state: FieldState,
  playerColor: FigureColor,
  callback: (cell: CellModel, pos: Coordinate) => void,
): void {
  forEachCell(state, (cell, pos) => {
    if (cell.getFigure() && cell.getFigureColor() === playerColor) {
      callback(cell, pos);
    }
  });
}
export function getKingPosition(state: FieldState, color: number): Coordinate | null {
  let kingPosition: Coordinate | null = null;
  forEachPlayerFigure(state, color, (cell, position) => {
    if (cell.getFigureType() === FigureType.KING) {
      kingPosition = position;
    }
  });
  return kingPosition;
}
export function getStateAfterMove(
  state: FieldState,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): FieldState {
  const newState = state.clone();
  exchangePositions(newState, new Coordinate(fromX, fromY), new Coordinate(toX, toY));
  return newState;
}
