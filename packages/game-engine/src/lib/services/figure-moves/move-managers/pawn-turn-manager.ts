import { Coordinate } from '@chess/coordinate';
import { FigureColor } from '@chess/game-common';
import type { FieldState, Pawn } from '@chess/game-engine';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as OneStepFigure from 'packages/game-engine/src/lib/models/one-step-figure';

export const getMoves = (
  state: FieldState,
  pawn: Pawn,
  fromX: number,
  fromY: number,
): Coordinate[] => {
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
};
