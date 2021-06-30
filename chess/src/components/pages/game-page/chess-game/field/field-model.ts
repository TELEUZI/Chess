/* eslint-disable class-methods-use-this */

import CellModel from '../cell/cell';
import Signal from '../components/signal';
import Vector from '../components/vector';
import FigureModel from '../figures/figure-model';
import FieldState from '../state/field-state';
import { makeMove } from '../state/redux/reducer';
import store from '../state/redux/store';
import createFigure from '../utils/figure-fabric';
import TurnManager from './turn-manager';

export interface TurnInfo {
  figure: string;
  moves: Vector[];
}
export default class FieldModel {
  public state: FieldState;

  private hist: Array<Vector[]> = [];

  public allowedMoves: Array<Vector>;

  public currentColor = 1;

  public onChange: Signal<FieldState> = new Signal();

  onCheck: Signal<Vector> = new Signal();

  onMate: Signal<Array<Vector>> = new Signal();

  onMove: Signal<TurnInfo> = new Signal();

  onNextTurn: Signal<number> = new Signal();

  turnManager: TurnManager;

  // bot: ChessBot;

  onReverse: () => void = () => {};

  constructor(reverse: () => void) {
    // this.bot = new ChessBot(this);
    this.onReverse = reverse;
    this.turnManager = new TurnManager();
  }

  autoMove() {
    this.hist.forEach((vector) => this.move(vector[0].x, vector[0].y, vector[1].x, vector[1].y));
  }

  move(fromX: number, fromY: number, toX: number, toY: number): void {
    const allowed = this.getAllowed(this.state, fromX, fromY);
    const isAllowed = allowed.findIndex((it) => {
      return it.x === toX && it.y === toY;
    });
    if (isAllowed === -1) {
      return;
    }
    if (
      store.getState().field.getCellAt(fromX, fromY).getFigure() &&
      store.getState().field.getFigureColor(fromX, fromY) === this.currentColor &&
      this.turnManager.checkMove(fromX, fromY, toX, toY)
    ) {
      this.hist.push([new Vector(fromX, fromY), new Vector(toX, toY)]);
      this.onMove.emit({
        figure: this.state.getCellAt(fromX, fromY).getFigureType(),
        moves: [new Vector(fromX, fromY), new Vector(toX, toY)],
      });
      this.state.getCellAt(toX, toY).setFigure(this.state.getCellAt(fromX, fromY).getFigure());
      this.state.getCellAt(fromX, fromY).setFigure(null);
      this.setState(this.state);
      store.dispatch(makeMove(this.state));
      this.currentColor = (this.currentColor + 1) % 2;
      this.onReverse?.();
      this.onNextTurn.emit(this.currentColor);
      if (this.getCheckedKing(this.state)) {
        console.log('check');
        this.onCheck.emit(this.hist[this.hist.length - 1][1]);
      } else {
        this.onCheck.emit(null);
      }
    }
  }

  getStateAfterMove(
    state_: FieldState,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
  ): FieldState {
    const state = this.cloneState(state_);
    this.exchangePositions(state, new Vector(fromX, fromY), new Vector(toX, toY));
    return state;
  }

  private cloneState(state: FieldState): FieldState {
    const newState = state.state.map((it) => {
      return it.map((jt) => {
        const newCell = new CellModel(this.createFig(jt.getFigure() ? jt.getFigureType() : ' '));
        if (newCell.getFigure()) {
          newCell.setFigureColor(jt.getFigureColor());
        }
        return newCell;
      });
    });
    return new FieldState(newState);
  }

  createFig(figure: string): FigureModel {
    let color: number;
    if (figure.trim() !== '') {
      color = figure.toLowerCase() === figure ? 0 : 1;
    }
    return createFigure(figure.toLowerCase(), color);
  }

  getAllowedFroms(
    state: FieldState,
    color: number,
    // type?: string,
  ): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    this.forEachPlayerFigure(state, color, (cell, pos) => {
      if (this.getMovesAtPoint(pos.x, pos.y).length) {
        res.push(pos);
      }
    });
    return res;
  }

  exchangePositions(state: FieldState, from: Vector, to: Vector): void {
    this.getCellAt(state, to).setFigure(this.getCellAt(state, from).getFigure());
    this.getCellAt(state, from).setFigure(null);
  }

  getCellAt(state: FieldState, to: Vector): CellModel {
    return state.getCellAt(to.x, to.y);
  }

  forEachCell(state: FieldState, callback: (cell: CellModel, pos: Vector) => void): void {
    state.state.forEach((it, i) => {
      it.forEach((jt, j) => {
        callback(jt, new Vector(i, j));
      });
    });
  }

  forEachPlayerFigure(
    state: FieldState,
    playerColor: number,
    callback: (cell: CellModel, pos: Vector) => void,
  ): void {
    this.forEachCell(state, (cell, pos) => {
      if (cell.getFigure() && cell.getFigureColor() === playerColor) {
        callback(cell, pos);
      }
    });
  }

  getAllowedFromsE(
    state: FieldState,
    color: number,
    type?: string,
  ): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    state.state.forEach((it, i) => {
      it.forEach((jt, j) => {
        if (jt.getFigure() && jt.getFigureColor() === color) {
          // if (jt.figure.getMoves(state, i, j).length){
          if (this.getAllowed(state, i, j).length) {
            if (type) {
              if (type === jt.getFigureType().toLowerCase()) {
                res.push({ x: i, y: j });
              }
            } else {
              res.push({ x: i, y: j });
            }
          }
        }
      });
    });
    return res;
  }

  checked(state: FieldState, posX: number, posY: number) {
    this.getCellAt(state, this.findCheckEnemy(this.state, posX, posY));
  }

  getCheckedKing(state: FieldState): boolean {
    // console.log(this.getAllowedFroms(this.currentColor));
    const kingPos = this.getKingPos(state, this.currentColor);
    return this.getCheckedStatus(state, kingPos.x, kingPos.y);
  }

  private getKingPos(state: FieldState, color: number) {
    let res: Vector;
    this.forEachPlayerFigure(state, color, (cell, pos) => {
      if (cell.getFigureType() === 'k') {
        res = pos;
      }
    });
    return res || null;
  }

  findCheckEnemy(state: FieldState, posX: number, posY: number): Vector {
    const enemies = this.getAllowedFroms(state, (this.currentColor + 1) % 2);
    let res;
    enemies.forEach((enemy) => {
      const allowed = this.getAllowedForEnemy(state, enemy.x, enemy.y);
      allowed.forEach((al) => {
        if (al.x === posX && al.y === posY) {
          res = enemy;
        }
      });
    });
    return res;
  }

  private getCheckedStatus(state: FieldState, posX: number, posY: number) {
    let res = false;
    const enemies = this.getAllowedFroms(state, (this.currentColor + 1) % 2);
    enemies.forEach((enemy) => {
      const allowed = this.getAllowedForEnemy(state, enemy.x, enemy.y);
      allowed.forEach((al) => {
        if (al.x === posX && al.y === posY) {
          res = true;
        }
      });
    });
    return res;
  }

  getAllowed = (
    state: FieldState,
    fromX: number,
    fromY: number,
  ): Array<{ x: number; y: number }> => {
    if (this.getCheckedKing(state)) {
      this.findCheckEnemy(state, fromX, fromY);
    }
    if (
      state.getCellAt(fromX, fromY).getFigure() &&
      state.getFigureColor(fromX, fromY) === this.currentColor
    ) {
      let moves: Array<{ x: number; y: number }> = this.turnManager.getMoves(
        store.getState().field.getCellAt(fromX, fromY).getFigure(),
        fromX,
        fromY,
      );
      moves = moves.filter((it) => {
        const nextState = this.getStateAfterMove(state, fromX, fromY, it.x, it.y);
        return !this.getCheckedKing(nextState);
      });
      return moves;
    }
    return [];
  };

  private getAllowedForEnemy(state: FieldState, fromX: number, fromY: number) {
    if (
      state.getCellAt(fromX, fromY).getFigure() &&
      state.getFigureColor(fromX, fromY) !== this.currentColor
    ) {
      return this.turnManager.getMoves(this.getFigureFromState(fromX, fromY), fromX, fromY);
    }
    return [];
  }

  getFigureFromState(fromX: number, fromY: number): FigureModel {
    return store.getState().field.getCellAt(fromX, fromY).getFigure();
  }

  getMovesAtPoint(fromX: number, fromY: number): { x: number; y: number }[] {
    return this.turnManager.getMoves(this.getFigureFromState(fromX, fromY), fromX, fromY);
  }

  setFromStrings(stringState: Array<string>): void {
    const newState = [];
    for (let i = 0; i < 8; i += 1) {
      const row = [];
      for (let j = 0; j < 8; j += 1) {
        const cell = new CellModel(this.createFig(stringState[i][j]));
        row.push(cell);
      }
      newState.push(row);
    }
    store.dispatch(makeMove(new FieldState(newState)));
    this.setState(new FieldState(newState));
  }

  setState(newState: FieldState): void {
    this.state = newState;
    // store.dispatch(makeMove(newState.state));
    this.onChange.emit(newState);
  }
}
