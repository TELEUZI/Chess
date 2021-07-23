import PageController from '../../interfaces/page';
import User from '../../interfaces/user';

import BaseComponent from '../base-component';
import BestScorePage from '../pages/best-score-page/best-score-page';
import GamePage from '../pages/game-page/game-page';
import AboutPage from '../pages/reg-page/start-page';
import RegFormModal from '../pages/reg-page/regform-window';
import SettingsPage from '../pages/settings-page/settings-page';
import Router from './router';
import HeaderStateManager from './state-manager';
import ReplayPage from '../pages/replay-page/replay-page';
import UserDaoService from '../../services/user-dao-service';
import store from '../pages/game-page/chess-game/state/redux/store';
import GameMode from '../../enums/game-mode';
import { socketService } from '../../services/websocket-service';

export default class Controller extends BaseComponent {
  private appRoot: BaseComponent;

  private router: Router;

  private modal: RegFormModal;

  private userModel: UserDaoService;

  private headerStateManager: HeaderStateManager;

  gamePage: GamePage;

  constructor() {
    super('div', ['app']);
    this.appRoot = new BaseComponent('div', ['page']);
    this.userModel = UserDaoService.getInstance();
    this.headerStateManager = new HeaderStateManager(this.toggleModal.bind(this));
    this.insertChild(this.appRoot);
    this.modal = new RegFormModal(this.onRegister.bind(this));
    this.insertChild(this.modal);
    this.gamePage = new GamePage(this.getAppRoot());
    this.router = new Router(
      [
        {
          name: 'default',
          controller: new AboutPage(this.getAppRoot()),
        },
        {
          name: 'settings',
          controller: new SettingsPage(this.getAppRoot()),
        },
        {
          name: 'replay',
          controller: new BestScorePage(this.getAppRoot()),
        },
        {
          name: 'game',
          controller: this.gamePage,
        },
        { name: 'watch', controller: new ReplayPage(this.getAppRoot()) },
      ],
      this.moveToPage.bind(this),
    );
  }

  async moveToRegisteredState(): Promise<void> {
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  toggleModal(): void {
    this.modal.toggleClass('hidden');
  }

  moveToPage(page: PageController): void {
    this.render(page);
  }

  render(page: PageController): void {
    this.appRoot.getNode().innerHTML = '';
    this.getNode().prepend(this.headerStateManager.getHeaderNode());
    page.createPage();
  }

  getAppRoot(): HTMLElement {
    return this.appRoot.getNode();
  }

  async onRegister(user: User): Promise<void> {
    this.userModel.setData(user);
    this.modal.toggleModal();
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  async offerLooseGame(): Promise<void> {
    window.location.hash = '#default';
    if (store.getState().gameMode.currentGameMode === GameMode.MULTIPLAYER) {
      socketService.endGame('end');
    }
    this.gamePage.endGame();
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  async offerDraw(): Promise<void> {
    if (store.getState().gameMode.currentGameMode === GameMode.MULTIPLAYER) {
      socketService.suggestDraw();
    }
    console.log(this);
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  startGame(): void {
    window.location.hash = '#game';
    this.headerStateManager.transitionToStopGameState(
      () => this.offerLooseGame(),
      () => this.offerDraw(),
    );
  }
}
