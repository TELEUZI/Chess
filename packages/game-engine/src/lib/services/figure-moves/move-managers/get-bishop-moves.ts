import type { Coordinate } from '@chess/coordinate';
import { MOVES, getMultipleStepPerTurnMoves } from '../../../models';

export const getBishopMoves = getMultipleStepPerTurnMoves.bind(null, MOVES.BISHOP as Coordinate[]);
