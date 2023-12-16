import { TABLE_SIZE } from '@client/app/config';
import { FigureColor } from '@chess/game-common';
import CellModel from '../models/cell-model';
import type FigureModel from '../models/figures/figure-model';
import { createFigureFromString } from '../fabrics/figure-fabric';

export function isInField(x: number, y: number): boolean {
  return x >= 0 && x < TABLE_SIZE && y >= 0 && y < TABLE_SIZE;
}
export function emptyBoard(): string[][] {
  const board = [];
  for (let i = 0; i < TABLE_SIZE; i += 1) {
    board[i] = [];
  }
  return board;
}

export default class FieldState {
  public state: CellModel[][];

  constructor(initState: CellModel[][]) {
    this.state = initState;
  }

  public getCellAt(x: number, y: number): CellModel | null {
    if (isInField(x, y)) {
      return this.state[x][y];
    }
    return null;
  }

  public setFigureAtCell(figure: FigureModel | null, x: number, y: number): void {
    if (isInField(x, y)) {
      this.state[x][y].setFigure(figure);
    }
  }

  public getFigure(x: number, y: number): FigureModel | null {
    if (isInField(x, y)) {
      return this.getCellAt(x, y)?.getFigure() ?? null;
    }
    return null;
  }

  public getFigureColor(x: number, y: number): number | null {
    if (isInField(x, y)) {
      return this.getCellAt(x, y)?.getFigureColor() ?? null;
    }
    return null;
  }

  public getPlainState(): string[][] {
    const state = emptyBoard();
    for (let i = 0; i < TABLE_SIZE; i += 1) {
      for (let j = 0; j < TABLE_SIZE; j += 1) {
        state[i][j] = this.state[i][j]?.getFigureType() ?? ' ';
        if (state[i][j])
          state[i][j] =
            this.state[i][j]?.getFigureColor() === FigureColor.WHITE
              ? state[i][j].toUpperCase()
              : state[i][j];
      }
    }
    return state;
  }

  public clone(): FieldState {
    const newState = this.state.map((it) => {
      return it.map((jt) => {
        const figure = jt.getFigure();
        const newCell = new CellModel(createFigureFromString(figure ? figure.getType() : ' '));
        if (newCell.getFigure() && figure?.getColor()) {
          newCell.setFigureColor(figure.getColor());
        }
        return newCell;
      });
    });
    return new FieldState(newState);
  }
}
