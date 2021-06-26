import PageController from '../../../interfaces/page';
import Timer from '../../timer/timer';
import PopUpWindow from '../../pop-up/pop-up';
import ModalWindow from '../reg-page/modal-window';
import BaseComponent from '../../base-component';
import UserDaoService from '../../../models/user-dao-service';

export default class GamePage implements PageController {
  private root: HTMLElement;

  private userDao: UserDaoService;

  private timer: Timer;

  private popUp: PopUpWindow;

  private modal: ModalWindow;

  constructor(root: HTMLElement) {
    this.root = root;
    this.userDao = UserDaoService.getInstance();
    this.popUp = new PopUpWindow('');
    this.popUp.onOkClick = this.toggleModal.bind(this);
    this.modal = new ModalWindow(this.popUp, root);
    this.toggleModal();
  }

  createPage(): void {
    this.root.innerHTML = '';
    this.startGame();
    this.root.append(this.timer.getNode());
    this.root.appendChild(this.modal.getNode());
  }

  startGame(): void {
    this.timer = new Timer();
    this.timer.start(0);
  }

  toggleModal(): void {
    this.modal.toggleModal();
  }

  createWinPopup(result: string): void {
    const resultText = new BaseComponent('span', [], result);
    this.popUp.insertChild(resultText);
  }

  updateUserScore(score: number): void {
    const currentUser = this.userDao.getCurrentUser();
    currentUser.score = score;
    this.userDao.updateUserScore(currentUser);
  }
}
