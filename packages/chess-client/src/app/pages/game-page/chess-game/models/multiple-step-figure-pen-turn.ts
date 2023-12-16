import { Coordinate } from '@chess/coordinate';
import { storeService } from '@client/app/pages/game-page/chess-game/state/store-service';
import type FigureModel from './figures/figure-model';
import type FieldState from '../state/field-state';
import * as MultipleStepFigure from './multiple-step-figure';

export const getMoves = (
  initialMoves: Coordinate[],
  state: FieldState,
  figure: FigureModel,
  fromX: number,
  fromY: number,
): Coordinate[] => {
  const moves: Coordinate[] = [];
  initialMoves.forEach((move) => {
    let posX = fromX;
    let posY = fromY;
    do {
      posX += move.x;
      posY += move.y;
      if (MultipleStepFigure.isRightMove(state, figure, posX, posY)) {
        moves.push(new Coordinate(posX, posY));
      }
    } while (
      MultipleStepFigure.isRightMove(state, figure, posX, posY) &&
      !storeService.getFieldState().getCellAt(posX, posY)?.getFigure()
    );
  });
  return moves;
};
