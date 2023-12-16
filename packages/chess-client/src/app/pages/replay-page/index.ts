import { storeService } from '@client/app/pages/game-page/chess-game/state/store-service';
import type PageController from '../../interfaces/page';
import ReplayDaoService from '../../services/replay-dao-service';
import delay from '../../utils/delay';
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
