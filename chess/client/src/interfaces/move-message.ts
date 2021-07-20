import Coordinate from '../components/pages/game-page/chess-game/components/coordinate';

export default interface MoveMessage {
  from: Coordinate;
  to: Coordinate;
}
export interface TimedMoveMessage {
  from: Coordinate;
  to: Coordinate;
  time: number;
}
