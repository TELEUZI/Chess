import type { Coordinate } from '@chess/coordinate';
import { MOVES, getMultipleStepPerTurnMoves } from '../../../models';

export const getMoves = getMultipleStepPerTurnMoves.bind(null, MOVES.QUEEN as Coordinate[]);
