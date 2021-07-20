import { PlayerAddResponse } from '../../entities/message/message-interfaces';
import { rooms } from '../../entities/room/room';
import { buildToken } from '../player/player-tokenify';

export function addNewPlayer(roomName: string, playerName: string): PlayerAddResponse {
  const room = rooms.get(roomName);
  if (room == null) {
    throw new Error('Requested room does not exist.');
  }
  const playerInfo = room.game.addPlayer(playerName);
  const playerToken = buildToken({ roomName, playerName });
  rooms.set(roomName, room);
  return { playerInfo, playerToken };
}
