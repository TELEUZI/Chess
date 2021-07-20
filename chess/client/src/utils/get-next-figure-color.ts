import FigureColor from '../enums/figure-colors';

export default function getNextFigureColor(color: FigureColor): FigureColor {
  console.log(color, (color + 1) % 2);
  return (color + 1) % 2;
}
