import Bishop from '../figures/bishop';
import FigureModel from '../figures/figure-model';
import King from '../figures/king';
import Knight from '../figures/knight';
import Pawn from '../figures/pawn';
import Queen from '../figures/queen';
import Rook from '../figures/rook';

export default function createFigure(type: string, color: number): FigureModel {
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
  let color: number;
  if (figure.trim() !== '') {
    color = figure.toLowerCase() === figure ? 0 : 1;
  }
  return createFigure(figure.toLowerCase(), color);
}
