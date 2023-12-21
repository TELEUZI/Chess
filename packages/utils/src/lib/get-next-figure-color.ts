import type { FigureColor } from '@chess/game-common';

export function getNextFigureColor(color: FigureColor): FigureColor {
  return (color + 1) % 2;
}
