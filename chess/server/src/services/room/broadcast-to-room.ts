import WebSocket, { ErrorEvent } from 'ws';
import { GameInfo } from '../../entities/game/game-interfaces';
import { rooms } from '../../entities/room/room';

export interface WsMessage {
  action: string;
  payload: GameInfo;
}
export default function broadcastToRoom(
  room: string,
  message: WsMessage | { error: ErrorEvent },
  excludePlayer?: string | string[],
): void {
  const roomObj = rooms.get(room);
  if (roomObj === null) {
    return;
  }
  const messageStr = JSON.stringify(message);
  roomObj.clients.forEach((cWs, cName) => {
    if (
      cName !== excludePlayer &&
      !(Array.isArray(excludePlayer) && excludePlayer.includes(cName)) &&
      cWs.readyState === WebSocket.OPEN
    ) {
      cWs.send(messageStr);
    }
  });
}
