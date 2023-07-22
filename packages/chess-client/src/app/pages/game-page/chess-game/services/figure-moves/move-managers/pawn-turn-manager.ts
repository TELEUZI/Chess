import { Coordinate } from '@coordinate';
import FigureColor from '@client/app/enums/figure-colors';
import type Pawn from '../../../models/figures/pawn';
import OneStepFigure from '../../../models/one-step-figure';
import type FieldState from '../../../state/field-state';

export default class PawnTurnManager extends OneStepFigure {
  static getMoves(state: FieldState, pawn: Pawn, fromX: number, fromY: number): Coordinate[] {
    const res: Coordinate[] = [];
    const direction = pawn.getColor() === FigureColor.WHITE ? -1 : 1;
    let posX = fromX + direction;
    let posY = fromY;
    if (OneStepFigure.isRightMove(state, posX, posY)) {
      res.push(new Coordinate(posX, posY));
    }
    if (
      (fromX === 6 && pawn.getColor() === FigureColor.WHITE) ||
      (fromX === 1 && pawn.getColor() === FigureColor.BLACK)
    ) {
      posX = fromX + direction;
      posY = fromY;
      if (OneStepFigure.isRightMove(state, posX, posY)) {
        posX = fromX + direction * 2;
        posY = fromY;
        if (OneStepFigure.isRightMove(state, posX, posY)) {
          res.push(new Coordinate(posX, posY));
        }
      }
    }
    posX = fromX + direction;
    posY = fromY + 1;
    if (OneStepFigure.isEnemyOnDiagonal(state, pawn, posX, posY)) {
      res.push(new Coordinate(posX, posY));
    }
    posX = fromX + direction;
    posY = fromY - 1;
    if (OneStepFigure.isEnemyOnDiagonal(state, pawn, posX, posY)) {
      res.push(new Coordinate(posX, posY));
    }
    return res;
  }
}
