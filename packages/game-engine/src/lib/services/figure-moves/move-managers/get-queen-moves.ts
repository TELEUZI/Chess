import type { Coordinate } from '@chess/coordinate';
import { MOVES, getMultipleStepPerTurnMoves } from '../../../models';

export const getQueenMoves = getMultipleStepPerTurnMoves.bind(null, MOVES.QUEEN as Coordinate[]);
