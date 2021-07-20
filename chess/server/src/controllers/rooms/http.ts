import { NextFunction, Request, Response } from 'express';
import { rooms } from '../../entities/room/room';
import { GameExternalInfo } from '../../entities/game/game-interfaces';
import { createGameRoom } from '../../services/room/create-game-room';
import { addNewPlayer } from '../../services/room/add-player';

export function getRooms(req: Request, res: Response): void {
  const result = Object.fromEntries(rooms);
  res.json(result);
}
export function getRoomInfo(roomName: string): null | GameExternalInfo {
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
    return next(new Error('creatorName query item not provided or not type string.'));
  }
  const result = createGameRoom(req.params.roomName, creatorName as string);
  if (result.roomCreated) res.status(201).json(result);
  else res.status(400).json(result);
}

export function addPlayer(req: Request, res: Response, next: NextFunction): void {
  const { playerName } = req.query;
  if (typeof playerName !== 'string') {
    return next(new Error('playerName query item not provided or not type string.'));
  }
  const result = addNewPlayer(req.params.roomName, playerName);
  res.json(result);
}
