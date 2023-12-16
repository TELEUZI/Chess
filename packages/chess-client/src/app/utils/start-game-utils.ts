import { setGameMode } from '../pages/game-page/chess-game/state/redux/action-creators';
import store from '../pages/game-page/chess-game/state/redux/store';
import type GameMode from '../enums/game-mode';

export default function redirectToGameWithMode(gameMode: GameMode): void {
  store.dispatch(setGameMode(gameMode));
  window.location.hash = '#game';
}
