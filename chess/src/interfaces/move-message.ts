export default interface MoveMessage {
  type: 'move';
  from: { x: number; y: number };
  to: { x: number; y: number };
}
