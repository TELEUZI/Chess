import WebSocket from 'ws';
import Game from '../game/Game';

export interface Room {
  game: Game;
  clients: Map<string, WebSocket>;
}

export const rooms = new Map<string, Room>();
