import type { Coordinate } from '@chess/coordinate';

import type { FieldState, FigureModel } from '@chess/game-engine';
import { FigureType } from '@chess/game-common';
import { getBishopMoves } from './move-managers/get-bishop-moves';
import { getKingMoves } from './move-managers/get-king-moves';
import { getKnightMoves } from './move-managers/get-knight-moves';
import { getPawnMoves } from './move-managers/get-pawn-moves';
import { getQueenMoves } from './move-managers/get-queen-moves';
import { getRookMoves } from './move-managers/get-rook-moves';

const movesByFigureType = {
  [FigureType.PAWN]: getPawnMoves,
  [FigureType.KNIGHT]: getKnightMoves,
  [FigureType.BISHOP]: getBishopMoves,
  [FigureType.KING]: getKingMoves,
  [FigureType.ROOK]: getRookMoves,
  [FigureType.QUEEN]: getQueenMoves,
};

export const getMoves = (
  state: FieldState,
  figure: FigureModel | null,
  fromX: number,
  fromY: number,
): Coordinate[] => {
  if (!figure) return [];
  const figureType = figure.getType();
  const moveManager = movesByFigureType[figureType];
  return moveManager({ state, figure, fromX, fromY });
};
