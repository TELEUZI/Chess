import PageController from '../../../interfaces/page';
import ReplayDaoService from '../../../services/replay-dao-service';
import delay from '../../../utils/delay';
import Chess from '../game-page/chess-game/chess';
import store from '../game-page/chess-game/state/redux/store';

export default class ReplayPage implements PageController {
  private root: HTMLElement;

  private replayModel = ReplayDaoService.getInstance();

  private game: Chess;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  createPage(): void {
    this.root.innerHTML = '';
    this.startGame();
  }

  async startGame(): Promise<void> {
    this.game = new Chess(this.root, true);
    const replay = await this.replayModel.getByDate(store.getState().replayDate.currentReplayDate);
    Promise.all(
      replay.history.map((move) => {
        return delay(move.time * 1000).then(() => this.game.makeMove(move.from, move.to));
      }),
    ).then(() => {
      this.game.stopTimer();
    });
  }
}
