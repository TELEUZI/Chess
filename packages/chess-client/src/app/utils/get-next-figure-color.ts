import type FigureColor from '../enums/figure-colors';

export default function getNextFigureColor(color: FigureColor): FigureColor {
  return (color + 1) % 2;
}
