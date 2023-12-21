import { Coordinate } from '@chess/coordinate';
import { FigureColor } from '@chess/game-common';
import { isRightMove, type FieldState, type Pawn, isEnemyOnDiagonal } from '@chess/game-engine';

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
  if (isRightMove(state, posX, posY)) {
    res.push(new Coordinate(posX, posY));
  }
  if (
    (fromX === 6 && pawn.getColor() === FigureColor.WHITE) ||
    (fromX === 1 && pawn.getColor() === FigureColor.BLACK)
  ) {
    posX = fromX + direction;
    posY = fromY;
    if (isRightMove(state, posX, posY)) {
      posX = fromX + direction * 2;
      posY = fromY;
      if (isRightMove(state, posX, posY)) {
        res.push(new Coordinate(posX, posY));
      }
    }
  }
  posX = fromX + direction;
  posY = fromY + 1;
  if (isEnemyOnDiagonal(state, pawn, posX, posY)) {
    res.push(new Coordinate(posX, posY));
  }
  posX = fromX + direction;
  posY = fromY - 1;
  if (isEnemyOnDiagonal(state, pawn, posX, posY)) {
    res.push(new Coordinate(posX, posY));
  }
  return res;
};
