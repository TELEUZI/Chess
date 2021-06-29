import Cell from '../cell/cell';
import FigureModel from '../figures/figure-model';

function isInField(x: number, y: number): boolean {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}
export default class FieldState {
  state: Cell[][];

  constructor(initState: Cell[][]) {
    this.state = initState;
  }

  getCellAt(x: number, y: number): Cell {
    if (isInField(x, y)) {
      return this.state[x][y];
    }
    return null;
  }

  getFigure(x: number, y: number): FigureModel {
    if (isInField(x, y)) {
      return this.getCellAt(x, y).getFigure();
    }
    return null;
  }

  getFigureColor(x: number, y: number): number {
    if (isInField(x, y)) {
      return this.getCellAt(x, y).getFigureColor();
    }
    return null;
  }
}
