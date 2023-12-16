import type { Coordinate } from '@chess/coordinate';
import * as MultipleStepsPerTurnFigure from '@client/app/pages/game-page/chess-game/models/multiple-step-figure-pen-turn';
import MOVES from '../../../models/figure-actions';

export const getMoves = MultipleStepsPerTurnFigure.getMoves.bind(null, MOVES.QUEEN as Coordinate[]);
