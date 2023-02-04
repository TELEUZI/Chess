import type WebSocket from 'ws';
import type Game from '../game/game';

export interface Room {
  game: Game;
  clients: Map<string, WebSocket>;
}

export const rooms = new Map<string, Room>();
