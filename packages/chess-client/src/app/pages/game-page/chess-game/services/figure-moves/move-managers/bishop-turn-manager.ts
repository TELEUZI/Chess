import type { Coordinate } from '@coordinate';
import MultipleStepsPerTurnFigure from '@client/app/pages/game-page/chess-game/models/multiple-step-figure-pen-turn';
import MOVES from '../../../models/figure-actions';

export default class BishopTurnManager {
  public static getMoves = MultipleStepsPerTurnFigure.getMoves.bind(
    null,
    MOVES.BISHOP as Coordinate[],
  );
}
