/* eslint-disable class-methods-use-this */

import { socket } from '../../../reg-page/start-page-view';
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

  public currentColor = 0;

  public onChange: Signal<FieldState> = new Signal();

  onCheck: Signal<Vector> = new Signal();

  onMate: Signal<Array<Vector>> = new Signal();

  onMove: Signal<TurnInfo> = new Signal();

  onNextTurn: Signal<number> = new Signal();

  turnManager: TurnManager;

  // bot: ChessBot;

  onReverse: () => void = () => {};

  userColor: number;

  constructor(reverse: () => void) {
    // this.bot = new ChessBot(this);
    this.onReverse = reverse;
    this.turnManager = new TurnManager();
    this.state = store.getState().field;
  }

  autoMove(): void {
    this.hist.forEach((vector) => this.move(vector[0].x, vector[0].y, vector[1].x, vector[1].y));
  }

  oppentMove(fromX: number, fromY: number, toX: number, toY: number): void {
    console.log('opponent move');
    this.state.getCellAt(toX, toY).setFigure(this.state.getCellAt(fromX, fromY).getFigure());
    this.state.getCellAt(fromX, fromY).setFigure(null);
    this.setState(this.state);
    store.dispatch(makeMove(this.state));
  }

  move(fromX: number, fromY: number, toX: number, toY: number): void {
    const allowed = this.getAllowed(fromX, fromY);
    const isAllowed = allowed.findIndex((it) => {
      return it.x === toX && it.y === toY;
    });
    if (isAllowed === -1) {
      return;
    }
    if (
      this.state.getCellAt(fromX, fromY).getFigure() &&
      this.state.getFigureColor(fromX, fromY) === this.currentColor &&
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
      socket.send(
        JSON.stringify({
          type: 'move',
          payload: { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } },
        }),
      );
      if (!this.userColor) {
        this.currentColor = (this.currentColor + 1) % 2;
        this.onReverse?.();
        this.onNextTurn.emit(this.currentColor);
      }
      if (this.getCheckedKing()) {
        console.log('check');
        this.onCheck.emit(this.hist[this.hist.length - 1][1]);
      } else {
        this.onCheck.emit(null);
      }
    }
  }

  getStateAfterMove(fromX: number, fromY: number, toX: number, toY: number): FieldState {
    const state = this.cloneState(this.state);
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
    color: number,
    // type?: string,
  ): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    this.forEachPlayerFigure(color, (cell, pos) => {
      if (this.getMovesAtPoint(pos.x, pos.y).length) {
        res.push(pos);
      }
    });
    return res;
  }

  exchangePositions(state: FieldState, from: Vector, to: Vector): void {
    state.getCellAt(to.x, to.y).setFigure(this.getFigureFromState(from.x, from.y));
    state.getCellAt(from.x, from.y).setFigure(null);
  }

  getCellAt(to: Vector): CellModel {
    return this.state.getCellAt(to.x, to.y);
  }

  forEachCell(state: FieldState, callback: (cell: CellModel, pos: Vector) => void): void {
    state.state.forEach((it, i) => {
      it.forEach((jt, j) => {
        callback(jt, new Vector(i, j));
      });
    });
  }

  forEachPlayerFigure(playerColor: number, callback: (cell: CellModel, pos: Vector) => void): void {
    this.forEachCell(this.state, (cell, pos) => {
      if (cell.getFigure() && cell.getFigureColor() === playerColor) {
        callback(cell, pos);
      }
    });
  }

  getAllowedFromsE(color: number, type?: string): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    this.state.state.forEach((it, i) => {
      it.forEach((jt, j) => {
        if (jt.getFigure() && jt.getFigureColor() === color) {
          // if (jt.figure.getMoves(state, i, j).length){
          if (this.getAllowed(i, j).length) {
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

  checked(posX: number, posY: number) {
    this.getCellAt(this.findCheckEnemy(posX, posY));
  }

  getCheckedKing(): boolean {
    const kingPos = this.getKingPos(this.currentColor);
    return this.getCheckedStatus(kingPos.x, kingPos.y);
  }

  private getKingPos(color: number) {
    let res: Vector;
    this.forEachPlayerFigure(color, (cell, pos) => {
      if (cell.getFigureType() === 'k') {
        res = pos;
      }
    });
    return res || null;
  }

  findCheckEnemy(posX: number, posY: number): Vector {
    const enemies = this.getAllowedFroms((this.currentColor + 1) % 2);
    let res;
    enemies.forEach((enemy) => {
      const allowed = this.getAllowedForEnemy(enemy.x, enemy.y);
      allowed.forEach((al) => {
        if (al.x === posX && al.y === posY) {
          res = enemy;
        }
      });
    });
    return res;
  }

  private getCheckedStatus(posX: number, posY: number): boolean {
    let res = false;
    const enemies = this.getAllowedFroms((this.currentColor + 1) % 2);
    enemies.forEach((enemy) => {
      const allowed = this.getAllowedForEnemy(enemy.x, enemy.y);
      allowed.forEach((al) => {
        if (al.x === posX && al.y === posY) {
          res = true;
        }
      });
    });
    return res;
  }

  getAllowed = (fromX: number, fromY: number): Array<{ x: number; y: number }> => {
    if (this.getCheckedKing()) {
      this.findCheckEnemy(fromX, fromY);
    }
    console.log(
      this.state.getFigure(fromX, fromY),
      this.state.getFigureColor(fromX, fromY) === this.currentColor,
    );
    if (
      this.state.getFigure(fromX, fromY) &&
      this.state.getFigureColor(fromX, fromY) === this.currentColor
    ) {
      let moves: Array<{ x: number; y: number }> = this.turnManager.getMoves(
        store.getState().field.getFigure(fromX, fromY),
        fromX,
        fromY,
      );
      moves = moves.filter(() => {
        // const nextState = this.getStateAfterMove(fromX, fromY, it.x, it.y);
        return !this.getCheckedKing();
      });
      return moves;
    }
    return [];
  };

  private getAllowedForEnemy(fromX: number, fromY: number) {
    if (
      this.state.getFigure(fromX, fromY) &&
      this.state.getFigureColor(fromX, fromY) !== this.currentColor
    ) {
      return this.turnManager.getMoves(this.getFigureFromState(fromX, fromY), fromX, fromY);
    }
    return [];
  }

  getFigureFromState(fromX: number, fromY: number): FigureModel {
    return store.getState().field.getFigure(fromX, fromY);
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
