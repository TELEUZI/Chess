import FigureColor from '../../../../../../enums/figure-colors';
import FigureType from '../../../../../../enums/figure-type';
import CellModel from '../../cell/cell-model';
import Coordinate from '../../../../../../models/coordinate';
import FigureModel from '../../models/figures/figure-model';
import FieldState from '../../state/field-state';
import store from '../../state/redux/store';

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

export function getFigureFromState(fromX: number, fromY: number): FigureModel {
  return store.getState().field.getFigure(fromX, fromY);
}

export function exchangePositions(state: FieldState, from: Coordinate, to: Coordinate): void {
  state.getCellAt(to.x, to.y).setFigure(state.getFigure(from.x, from.y));
  state.getCellAt(from.x, from.y).setFigure(null);
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
export function getKingPosition(state: FieldState, color: number): Coordinate {
  let res: Coordinate;
  forEachPlayerFigure(state, color, (cell, pos) => {
    if (cell.getFigureType() === FigureType.KING) {
      res = pos;
    }
  });
  return res || null;
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
