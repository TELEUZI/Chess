import type { PageController } from '@chess/game-common';
import Chess from './chess-game/chess';

export default class GamePage implements PageController {
  private readonly root: HTMLElement;

  private game: Chess | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public endGame(): void {
    this.game?.setPlayerLeave();
  }

  public createPage(): void {
    this.root.innerHTML = '';
    this.game = new Chess(this.root, false);
  }
}
