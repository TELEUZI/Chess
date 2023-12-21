import { FigureColor, FigureType } from '@chess/game-common';
import type { FigureModel } from '@chess/game-engine';
import { Pawn, Rook, Knight, Bishop, Queen, King } from '@chess/game-engine';

export function createFigure(type: string, color: FigureColor): FigureModel | null {
  const figures = new Map<string, [typeof FigureModel, FigureType]>([
    ['p', [Pawn, FigureType.PAWN]],
    ['r', [Rook, FigureType.ROOK]],
    ['n', [Knight, FigureType.KNIGHT]],
    ['b', [Bishop, FigureType.BISHOP]],
    ['q', [Queen, FigureType.QUEEN]],
    ['k', [King, FigureType.KING]],
  ]);
  const config = figures.get(type);
  if (!config) {
    return null;
  }
  const { 0: FigureClass, 1: figureType } = config;
  return new FigureClass(color, figureType);
}

export function createFigureFromString(figure: string): FigureModel | null {
  if (figure.trim() === '') {
    return null;
  }
  const color = figure.toLowerCase() === figure ? FigureColor.BLACK : FigureColor.WHITE;
  return createFigure(figure.toLowerCase(), color);
}
