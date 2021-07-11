/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import FigureModel from '../figures/figure-model';
import Pawn from '../figures/pawn';
import FieldState from '../state/field-state';
import store from '../state/redux/store';

import MOVES from '../vars/figure-actions';

abstract class OneStepFigure {
  isEnemyOnDiagonal(pawn: Pawn, posX: number, posY: number): boolean {
    return (
      store.getState().field.getCellAt(posX, posY) &&
      store.getState().field.getCellAt(posX, posY).getFigure() &&
      store.getState().field.getFigureColor(posX, posY) !== pawn.getColor()
    );
  }

  isRightMove(posX: number, posY: number): boolean {
    return (
      store.getState().field.getCellAt(posX, posY) &&
      !store.getState().field.getCellAt(posX, posY).getFigure()
    );
  }
}
abstract class MultipleStepFigure {
  moves: { x: number; y: number }[];

  isRightMove(figure: FigureModel, posX: number, posY: number): boolean {
    return (
      store.getState().field.getCellAt(posX, posY) &&
      (store.getState().field.getCellAt(posX, posY).getFigure() === null ||
        store.getState().field.getFigureColor(posX, posY) !== figure.getColor())
    );
  }
}
class PawnTurnManager extends OneStepFigure {
  getMoves(pawn: Pawn, fromX: number, fromY: number): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    const direction = pawn.getColor() === 0 ? 1 : -1;
    let posX = fromX + direction;
    let posY = fromY;
    if (this.isRightMove(posX, posY)) {
      res.push({ x: posX, y: posY });
    }
    if ((fromX === 6 && pawn.getColor() === 1) || (fromX === 1 && pawn.getColor() === 0)) {
      posX = fromX + direction;
      posY = fromY;
      if (this.isRightMove(posX, posY)) {
        posX = fromX + direction * 2;
        posY = fromY;
        if (this.isRightMove(posX, posY)) {
          res.push({ x: posX, y: posY });
        }
      }
    }
    posX = fromX + direction;
    posY = fromY + 1;
    if (this.isEnemyOnDiagonal(pawn, posX, posY)) {
      res.push({ x: posX, y: posY });
    }
    posX = fromX + direction;
    posY = fromY - 1;
    if (this.isEnemyOnDiagonal(pawn, posX, posY)) {
      res.push({ x: posX, y: posY });
    }
    return res;
  }
}

class KnightTurnManager extends MultipleStepFigure {
  getMoves(figure: FigureModel, fromX: number, fromY: number): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    MOVES.knight.forEach((move) => {
      const posX = fromX + move.x;
      const posY = fromY + move.y;
      if (this.isRightMove(figure, posX, posY)) {
        res.push({ x: posX, y: posY });
      }
    });
    return res;
  }
}

class KingTurnManager extends MultipleStepFigure {
  getMoves(figure: FigureModel, fromX: number, fromY: number): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    MOVES.king.forEach((move) => {
      const posX = fromX + move.x;
      const posY = fromY + move.y;
      if (this.isRightMove(figure, posX, posY)) {
        res.push({ x: posX, y: posY });
      }
    });
    return res;
  }
}
abstract class MultipleStepsPerTurnFigure extends MultipleStepFigure {
  getMoves(figure: FigureModel, fromX: number, fromY: number): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    this.moves.forEach((move) => {
      let posX = fromX;
      let posY = fromY;
      do {
        posX += move.x;
        posY += move.y;
        if (this.isRightMove(figure, posX, posY)) {
          res.push({ x: posX, y: posY });
        }
      } while (
        this.isRightMove(figure, posX, posY) &&
        !store.getState().field.getCellAt(posX, posY).getFigure()
      );
    });
    return res;
  }
}
class RookTurnManager extends MultipleStepsPerTurnFigure {
  constructor() {
    super();
    this.moves = MOVES.rook;
  }
}
class BishopTurnManager extends MultipleStepsPerTurnFigure {
  constructor() {
    super();
    this.moves = MOVES.bishop;
  }
}
class QueenTurnManager extends MultipleStepsPerTurnFigure {
  constructor() {
    super();
    this.moves = MOVES.queen;
  }
}
export default class TurnManager {
  field: FieldState;

  pawnTurnManager: PawnTurnManager;

  knightTurnManager: KnightTurnManager;

  bishopTurnManager: BishopTurnManager;

  rookTurnManager: RookTurnManager;

  kingTurnManager: KingTurnManager;

  queenTurnManager: QueenTurnManager;

  constructor() {
    this.field = store.getState().field;
    this.pawnTurnManager = new PawnTurnManager();
    this.knightTurnManager = new KnightTurnManager();
    this.bishopTurnManager = new BishopTurnManager();
    this.rookTurnManager = new RookTurnManager();
    this.kingTurnManager = new KingTurnManager();
    this.queenTurnManager = new QueenTurnManager();
  }

  checkMove(fromX: number, fromY: number, toX: number, toY: number): boolean {
    this.field = store.getState().field;
    const figure = this.field.getCellAt(fromX, fromY).getFigure();
    const allowed = this.getMoves(figure, fromX, fromY);
    return allowed.findIndex((ax) => ax.x === toX && ax.y === toY) !== -1;
  }

  isRightMove(posX: number, posY: number): boolean {
    return this.field.getCellAt(posX, posY) && !this.field.getCellAt(posX, posY).getFigure();
  }

  getMoves(figure: FigureModel, fromX: number, fromY: number): Array<{ x: number; y: number }> {
    const res: Array<{ x: number; y: number }> = [];
    if (figure.getType() === 'p') {
      return this.pawnTurnManager.getMoves(figure, fromX, fromY);
    }
    if (figure.getType() === 'n') {
      return this.knightTurnManager.getMoves(figure, fromX, fromY);
    }
    if (figure.getType() === 'b') {
      return this.bishopTurnManager.getMoves(figure, fromX, fromY);
    }
    if (figure.getType() === 'k') {
      return this.kingTurnManager.getMoves(figure, fromX, fromY);
    }
    if (figure.getType() === 'r') {
      return this.rookTurnManager.getMoves(figure, fromX, fromY);
    }
    if (figure.getType() === 'q') {
      return this.queenTurnManager.getMoves(figure, fromX, fromY);
    }
    return res;
  }
}
