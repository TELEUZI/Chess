import Coordinate from '../../../../../models/coordinate';
import { TABLE_SIZE } from '../../../../../config';

export default function forEachCell<T>(
  cells: T[],
  callback: (cell: T, position: Coordinate) => void,
): void {
  cells.forEach((it, cellIndex) => {
    const x = Math.floor(cellIndex / TABLE_SIZE);
    const y = cellIndex % TABLE_SIZE;
    callback(it, new Coordinate(x, y));
  });
}
