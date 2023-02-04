import type PageController from '../../../interfaces/page';
import Chess from './chess-game/chess';

export default class GamePage implements PageController {
  private readonly root: HTMLElement;

  private game: Chess;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  endGame(): void {
    this.game.setPlayerLeave();
  }

  createPage(): void {
    this.root.innerHTML = '';
    this.startGame();
  }

  startGame(): void {
    this.game = new Chess(this.root, false);
  }
}
