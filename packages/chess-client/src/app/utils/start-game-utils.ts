import { storeService } from '@client/app/pages/game-page/chess-game/state/store-service';
import type GameMode from '../enums/game-mode';

export default function redirectToGameWithMode(gameMode: GameMode): void {
  storeService.setGameMode(gameMode);
  window.location.hash = '#game';
}
