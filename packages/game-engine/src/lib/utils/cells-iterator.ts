import { TABLE_SIZE } from '@chess/config';
import { Coordinate } from '@chess/coordinate';

export function forEachCell<T>(
  cells: T[],
  callback: (cell: T, position: Coordinate) => void,
): void {
  cells.forEach((it, cellIndex) => {
    const x = Math.floor(cellIndex / TABLE_SIZE);
    const y = cellIndex % TABLE_SIZE;
    callback(it, new Coordinate(x, y));
  });
}
