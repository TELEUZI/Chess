import Coordinate from '../models/coordinate';

export default interface MoveMessage {
  from: Coordinate;
  to: Coordinate;
}
export interface FigureTurn {
  from: Coordinate;
  to: Coordinate[];
}
export interface TimedMoveMessage {
  from: Coordinate;
  to: Coordinate;
  time: number;
}
