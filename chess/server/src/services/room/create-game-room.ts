import Game from '../../entities/game/game';
import { RoomCreateResponse } from '../../entities/message/message-interfaces';
import { rooms } from '../../entities/room/room';
import { buildToken } from '../player/player-tokenify';

export function createGameRoom(roomName: string, creatorName: string): RoomCreateResponse {
  const newGame = new Game();
  const playerInfo = newGame.addPlayer(creatorName);
  const playerToken = buildToken({ roomName, playerName: creatorName });
  rooms.set(roomName, { game: newGame, clients: new Map() });
  return { roomCreated: true, creator: { playerInfo, playerToken } };
}
