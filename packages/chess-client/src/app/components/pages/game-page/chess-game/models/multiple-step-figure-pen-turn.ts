import Coordinate from '../../../../../models/coordinate';
import type FigureModel from './figures/figure-model';
import type FieldState from '../state/field-state';
import store from '../state/redux/store';
import MultipleStepFigure from './multiple-step-figure';

export default abstract class MultipleStepsPerTurnFigure extends MultipleStepFigure {
  getMoves(state: FieldState, figure: FigureModel, fromX: number, fromY: number): Coordinate[] {
    const res: Coordinate[] = [];
    this.moves.forEach((move) => {
      let posX = fromX;
      let posY = fromY;
      do {
        posX += move.x;
        posY += move.y;
        if (MultipleStepFigure.isRightMove(state, figure, posX, posY)) {
          res.push(new Coordinate(posX, posY));
        }
      } while (
        MultipleStepFigure.isRightMove(state, figure, posX, posY) &&
        !store.getState().field.getCellAt(posX, posY).getFigure()
      );
    });
    return res;
  }
}
