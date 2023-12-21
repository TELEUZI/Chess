import type { Coordinate } from '@chess/coordinate';
import { MOVES, getMultipleStepPerTurnMoves } from '../../../models';

export const getMoves = getMultipleStepPerTurnMoves.bind(null, MOVES.BISHOP as Coordinate[]);
