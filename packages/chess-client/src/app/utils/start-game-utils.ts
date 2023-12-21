import type { GameMode } from '@chess/game-common';
import { storeService } from '@chess/game-engine';

export function redirectToGameWithMode(gameMode: GameMode): void {
  storeService.setGameMode(gameMode);
  window.location.hash = '#game';
}
