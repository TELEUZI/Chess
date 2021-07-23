import FigureColor from '../../../../../enums/figure-colors';
import CellModel from '../models/cell-model';
import FigureModel from '../models/figures/figure-model';
import createFigure from '../fabrics/figure-fabric';

export function createFigurefromString(figure: string): FigureModel {
  let color: number;
  if (figure.trim() !== '') {
    color = figure.toLowerCase() === figure ? FigureColor.BLACK : FigureColor.WHITE;
  }
  return createFigure(figure.toLowerCase(), color);
}

export function isInField(x: number, y: number): boolean {
  return x >= 0 && x < 8 && y >= 0 && y < 8;
}
export function emptyBoard(): string[][] {
  const board = [];
  for (let i = 0; i < 8; i += 1) {
    board[i] = [];
  }
  return board;
}

export default class FieldState {
  state: CellModel[][];

  constructor(initState: CellModel[][]) {
    this.state = initState;
  }

  getCellAt(x: number, y: number): CellModel {
    if (isInField(x, y)) {
      return this.state[x][y];
    }
    return null;
  }

  setFigureAtCell(figure: FigureModel, x: number, y: number): void {
    if (isInField(x, y)) {
      this.state[x][y].setFigure(figure);
    }
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

  getPlainState(): string[][] {
    const state = emptyBoard();
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        state[i][j] = this.state[i][j]?.getFigureType();
        if (state[i][j])
          state[i][j] =
            this.state[i][j]?.getFigureColor() === FigureColor.WHITE
              ? state[i][j].toUpperCase()
              : state[i][j];
      }
    }
    return state;
  }

  clone(): FieldState {
    const newState = this.state.map((it) => {
      return it.map((jt) => {
        const newCell = new CellModel(
          createFigurefromString(jt.getFigure() ? jt.getFigureType() : ' '),
        );
        if (newCell.getFigure()) {
          newCell.setFigureColor(jt.getFigureColor());
        }
        return newCell;
      });
    });
    return new FieldState(newState);
  }
}
