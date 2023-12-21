import { Coordinate } from '@chess/coordinate';
import type { FieldState, FigureModel } from '@chess/game-engine';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as MultipleStepFigure from 'packages/game-engine/src/lib/models/multiple-step-figure';
import { MOVES } from '../../../models';

export const getMoves = (
  state: FieldState,
  figure: FigureModel,
  fromX: number,
  fromY: number,
): Coordinate[] => {
  const res: Coordinate[] = [];
  MOVES.KING.forEach((move) => {
    const posX = fromX + move.x;
    const posY = fromY + move.y;
    if (MultipleStepFigure.isRightMove(state, figure, posX, posY)) {
      res.push(new Coordinate(posX, posY));
    }
  });
  return res;
};
