import { TABLE_SIZE } from '@chess/config';
import { FigureColor } from '@chess/game-common';
import type { FigureModel } from '@chess/game-engine';
import { createFigureFromString, getFenFromStringBoard } from '@chess/game-engine';
import { CellModel } from './models';

export function isInField(x: number, y: number): boolean {
  return x >= 0 && x < TABLE_SIZE && y >= 0 && y < TABLE_SIZE && x % 1 === 0 && y % 1 === 0;
}
export function emptyBoard(): string[][] {
  const board = [];
  for (let i = 0; i < TABLE_SIZE; i += 1) {
    board[i] = [];
  }
  return board;
}

export class FieldState {
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

  public getFenFromState(): string {
    return getFenFromStringBoard(this.getPlainState());
  }

  public clone(): FieldState {
    const newState = this.state.map((it) => {
      return it.map((jt) => {
        const figure = jt.getFigure();
        const newCell = new CellModel(createFigureFromString(figure ? figure.getType() : ' '));
        if (newCell.getFigure() && figure?.getColor() != null) {
          newCell.setFigureColor(figure.getColor());
        }
        return newCell;
      });
    });
    return new FieldState(newState);
  }

  private getPlainState(): string[][] {
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
}
