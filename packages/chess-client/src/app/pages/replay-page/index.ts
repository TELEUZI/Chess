import { storeService } from '@chess/game-engine';
import type { PageController } from '@chess/game-common';
import { delay } from '@chess/utils';
import { ReplayDaoService } from '@chess/dao';
import Chess from '../game-page/chess-game/chess';

export default class ReplayPage implements PageController {
  private readonly root: HTMLElement;

  private readonly replayModel = ReplayDaoService.getInstance();

  private game: Chess | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  public createPage(): void {
    this.root.innerHTML = '';
    this.startGame().catch(() => {
      console.error('Failed to start game');
    });
  }

  private async startGame(): Promise<void> {
    this.game = new Chess(this.root, true);
    const replay = await this.replayModel.getByDate(storeService.getCurrentReplayDate());
    if (!replay) {
      return;
    }
    await Promise.all(
      replay.history.map((move) =>
        delay(move.time * 1000).then(() => this.game?.makeMove(move.from, move.to)),
      ),
    ).then(() => {
      this.game?.stopTimer();
    });
  }
}
