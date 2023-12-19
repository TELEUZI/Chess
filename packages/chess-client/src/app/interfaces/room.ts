import type { GameExternalInfo } from '@chess/game-common';

export interface Room {
  clients: Map<string, WebSocket>;
  game: GameExternalInfo;
}
