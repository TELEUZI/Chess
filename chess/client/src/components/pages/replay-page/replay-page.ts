import PageController from '../../../interfaces/page';
import ReplayDaoService from '../../../services/replay-dao-service';
import delay from '../../../utils/delay';
import BaseComponent from '../../base-component';
import PopUpWindow from '../../pop-up/pop-up';
import Chess from '../game-page/chess-game/chess';
import store from '../game-page/chess-game/state/redux/store';
import ModalContent from '../reg-page/modal-content';
import ModalWindow from '../reg-page/modal-window';

export default class ReplayPage implements PageController {
  private root: HTMLElement;

  private replayModel = ReplayDaoService.getInstance();

  private game: Chess;

  private popUp: PopUpWindow;

  private modal: ModalWindow;

  constructor(root: HTMLElement) {
    this.root = root;
    this.popUp = new PopUpWindow('');
    const winContent = new ModalContent({
      header: 'string',
      text: 'string',
      buttonText: 'string',
    });
    this.modal = new ModalWindow(
      winContent,
      () => {
        window.location.hash = '#default';
      },
      root,
    );
    this.toggleModal();
  }

  createPage(): void {
    this.root.innerHTML = '';
    this.startGame();
    this.root.appendChild(this.modal.getNode());
  }

  async startGame(): Promise<void> {
    this.game = new Chess(this.root, true);
    const replay = await this.replayModel.getByDate(store.getState().replayDate.currentReplayDate);
    Promise.all(
      replay.history.map((move) => {
        return delay(move.time * 1000).then(() => this.game.makeMove(move.from, move.to));
      }),
    ).then(() => {
      this.game.timer.toggle();
    });
  }

  toggleModal(): void {
    this.modal.toggleModal();
  }

  createWinPopup(result: string): void {
    const resultText = new BaseComponent('span', [], result);
    this.popUp.insertChild(resultText);
  }
}
