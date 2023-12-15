import { Coordinate } from '@coordinate';
import type FigureModel from './figures/figure-model';
import type FieldState from '../state/field-state';
import store from '../state/redux/store';
import MultipleStepFigure from './multiple-step-figure';

export default abstract class MultipleStepsPerTurnFigure extends MultipleStepFigure {
  public static getMoves(
    initialMoves: Coordinate[],
    state: FieldState,
    figure: FigureModel,
    fromX: number,
    fromY: number,
  ): Coordinate[] {
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
        !store.getState().field.getCellAt(posX, posY)?.getFigure()
      );
    });
    return moves;
  }
}
