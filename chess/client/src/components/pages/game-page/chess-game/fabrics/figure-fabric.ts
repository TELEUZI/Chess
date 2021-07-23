import FigureColor from '../../../../../enums/figure-colors';
import Bishop from '../models/figures/bishop';
import FigureModel from '../models/figures/figure-model';
import King from '../models/figures/king';
import Knight from '../models/figures/knight';
import Pawn from '../models/figures/pawn';
import Queen from '../models/figures/queen';
import Rook from '../models/figures/rook';

export default function createFigure(type: string, color: FigureColor): FigureModel {
  const figures: Map<string, typeof FigureModel> = new Map([
    ['p', Pawn],
    ['r', Rook],
    ['n', Knight],
    ['b', Bishop],
    ['q', Queen],
    ['k', King],
  ]);
  const FigureClass = figures.get(type);
  return FigureClass ? new FigureClass(color) : null;
}

export function createFigurefromString(figure: string): FigureModel {
  let color: FigureColor;
  if (figure.trim() !== '') {
    color = figure.toLowerCase() === figure ? FigureColor.BLACK : FigureColor.WHITE;
  }
  return createFigure(figure.toLowerCase(), color);
}
