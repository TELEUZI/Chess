import type { NextFunction, Request, Response } from 'express';
import { rooms } from '../../entities/room/room';
import type { GameExternalInfo } from '../../entities/game/game-interfaces';
import { createGameRoom } from '../../services/room/create-game-room';
import { addNewPlayer } from '../../services/room/add-player';

export function getRooms(req: Request, res: Response): void {
  const result = Object.fromEntries(rooms);
  res.json(result);
}
export function getRoomInfo(roomName: string): GameExternalInfo | null {
  const room = rooms.get(roomName);
  if (room == null) {
    return null;
  }
  return room.game.buildGameExternalInfo();
}
export function getRoom(req: Request, res: Response): void {
  const result = getRoomInfo(req.params.roomName);
  res.json(result);
}

export function createRoom(req: Request, res: Response, next: NextFunction): void {
  const { creatorName } = req.query;
  if (typeof creatorName !== 'string') {
    next(new Error('creatorName query was not provided'));
    return;
  }
  const result = createGameRoom(req.params.roomName, creatorName);
  if (result.roomCreated) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
}

export function addPlayer(req: Request, res: Response, next: NextFunction): void {
  const { playerName } = req.query;
  if (typeof playerName !== 'string') {
    next(new Error('playerName query item not provided or is not type string.'));
    return;
  }
  const result = addNewPlayer(req.params.roomName, playerName);
  res.json(result);
}
