import Coordinate from '../../../../../../../models/coordinate';
import type FigureModel from '../../../models/figures/figure-model';
import MultipleStepFigure from '../../../models/multiple-step-figure';
import type FieldState from '../../../state/field-state';
import MOVES from '../../../models/figure-actions';

export default class KingTurnManager extends MultipleStepFigure {
  static getMoves(
    state: FieldState,
    figure: FigureModel,
    fromX: number,
    fromY: number,
  ): Coordinate[] {
    const res: Coordinate[] = [];
    MOVES.KING.forEach((move) => {
      const posX = fromX + move.x;
      const posY = fromY + move.y;
      if (MultipleStepFigure.isRightMove(state, figure, posX, posY)) {
        res.push(new Coordinate(posX, posY));
      }
    });
    return res;
  }
}
