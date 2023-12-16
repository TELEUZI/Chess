import type { PlayerAddResponse } from '@chess/game-common';
import { rooms } from '../../entities/room/room';
import generateRandomString from '../../utils/postfix-generator';
import { buildToken } from '../player/player-tokenify';

export function addNewPlayer(roomName: string, playerName: string): PlayerAddResponse {
  const room = rooms.get(roomName);
  if (room == null) {
    throw new Error('Requested room does not exist.');
  }
  const userName = room.game.getPlayers().has(playerName)
    ? playerName + generateRandomString()
    : playerName;
  const playerInfo = room.game.addPlayer(playerName);
  const playerToken = buildToken({ roomName, playerName: userName });
  rooms.set(roomName, room);
  return { playerInfo, playerToken };
}
