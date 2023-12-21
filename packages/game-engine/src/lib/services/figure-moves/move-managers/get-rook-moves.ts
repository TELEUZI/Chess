import type { Coordinate } from '@chess/coordinate';
import { MOVES, getMultipleStepPerTurnMoves } from '../../../models';

export const getRookMoves = getMultipleStepPerTurnMoves.bind(null, MOVES.ROOK as Coordinate[]);
