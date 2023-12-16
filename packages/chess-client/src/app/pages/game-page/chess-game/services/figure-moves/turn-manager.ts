import type { Coordinate } from '@coordinate';
import FigureType from '@client/app/enums/figure-type';
import type FigureModel from '../../models/figures/figure-model';
import type FieldState from '../../state/field-state';
import * as BishopTurnManager from './move-managers/bishop-turn-manager';
import * as KingTurnManager from './move-managers/king-turn-manager';
import * as KnightTurnManager from './move-managers/knight-turn-manager';
import * as PawnTurnManager from './move-managers/pawn-turn-manager';
import * as QueenTurnManager from './move-managers/queen-turn-manager';
import * as RookTurnManager from './move-managers/rook-turn-manager';

export const getMoves = (
  state: FieldState,
  figure: FigureModel | null,
  fromX: number,
  fromY: number,
): Coordinate[] => {
  if (!figure) return [];
  const figureType = figure.getType();
  if (figureType === FigureType.PAWN) {
    return PawnTurnManager.getMoves(state, figure, fromX, fromY);
  }
  if (figureType === FigureType.KNIGHT) {
    return KnightTurnManager.getMoves(state, figure, fromX, fromY);
  }
  if (figureType === FigureType.BISHOP) {
    return BishopTurnManager.getMoves(state, figure, fromX, fromY);
  }
  if (figureType === FigureType.KING) {
    return KingTurnManager.getMoves(state, figure, fromX, fromY);
  }
  if (figureType === FigureType.ROOK) {
    return RookTurnManager.getMoves(state, figure, fromX, fromY);
  }
  return QueenTurnManager.getMoves(state, figure, fromX, fromY);
};
