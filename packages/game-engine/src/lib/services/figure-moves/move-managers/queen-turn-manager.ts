import type { Coordinate } from '@chess/coordinate';
// eslint-disable-next-line @nx/enforce-module-boundaries
import * as MultipleStepsPerTurnFigure from 'packages/game-engine/src/lib/models/multiple-step-figure-pen-turn';
import { MOVES } from '../../../models';

export const getMoves = MultipleStepsPerTurnFigure.getMoves.bind(null, MOVES.QUEEN as Coordinate[]);
