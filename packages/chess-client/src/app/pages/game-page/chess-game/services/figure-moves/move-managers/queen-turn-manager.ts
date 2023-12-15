import type { Coordinate } from '@coordinate';
import MultipleStepsPerTurnFigure from '@client/app/pages/game-page/chess-game/models/multiple-step-figure-pen-turn';
import MOVES from '../../../models/figure-actions';

export default class QueenTurnManager {
  static getMoves = MultipleStepsPerTurnFigure.getMoves.bind(null, MOVES.QUEEN as Coordinate[]);
}
