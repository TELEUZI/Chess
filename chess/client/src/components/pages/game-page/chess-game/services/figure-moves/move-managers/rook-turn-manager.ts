import Coordinate from '../../../../../../../models/coordinate';
import MOVES from '../../../models/figure-actions';
import MultipleStepsPerTurnFigure from '../../../models/multiple-step-figure-pen-turn';

export default class RookTurnManager extends MultipleStepsPerTurnFigure {
  constructor() {
    super();
    this.moves = MOVES.ROOK as Coordinate[];
  }
}
