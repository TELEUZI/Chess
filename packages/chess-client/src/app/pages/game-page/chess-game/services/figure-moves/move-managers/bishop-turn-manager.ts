import type { Coordinate } from '@coordinate';
import MOVES from '../../../models/figure-actions';
import MultipleStepsPerTurnFigure from '../../../models/multiple-step-figure-pen-turn';

export default class BishopTurnManager extends MultipleStepsPerTurnFigure {
  constructor() {
    super();
    this.moves = MOVES.BISHOP as Coordinate[];
  }
}
