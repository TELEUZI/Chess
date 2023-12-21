import { Coordinate } from '@chess/coordinate';
import type { FieldState, FigureModel } from '@chess/game-engine';

import { MOVES, isMultipleStepRightMove } from '../../../models';

export const getMoves = (
  state: FieldState,
  figure: FigureModel,
  fromX: number,
  fromY: number,
): Coordinate[] => {
  const res: Coordinate[] = [];
  MOVES.KNIGHT.forEach((move) => {
    const posX = fromX + move.x;
    const posY = fromY + move.y;
    if (isMultipleStepRightMove(state, figure, posX, posY)) {
      res.push(new Coordinate(posX, posY));
    }
  });
  return res;
};
