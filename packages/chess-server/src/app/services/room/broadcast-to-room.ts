import WebSocket from 'ws';
import type { WsMessage } from '@chess/game-common';
import { rooms } from '../../entities/room/room';

export default function broadcastToRoom(
  room: string,
  message: WsMessage | { error: string },
  excludePlayer?: string[] | string,
): void {
  const roomObj = rooms.get(room);
  if (roomObj == null) {
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
