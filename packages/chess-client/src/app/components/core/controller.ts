import type PageController from '../../interfaces/page';
import type User from '../../interfaces/user';

import BaseComponent from '../base-component';
import type GamePage from '../pages/game-page/game-page';
import RegFormModal from '../pages/reg-page/regform-window';
import Router from './router';
import HeaderStateManager from './state-manager';
import UserDaoService from '../../services/user-dao-service';
import store from '../pages/game-page/chess-game/state/redux/store';
import GameMode from '../../enums/game-mode';
import { socketService } from '../../services/websocket-service';
import AppRoutes from '../../enums/app-routes';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent;

  private readonly modal: RegFormModal;

  private readonly userModel: UserDaoService;

  private readonly headerStateManager: HeaderStateManager;

  private readonly gamePage: Promise<GamePage>;

  constructor() {
    super('div', ['app']);
    this.appRoot = new BaseComponent('div', ['page']);
    this.userModel = UserDaoService.getInstance();
    this.headerStateManager = new HeaderStateManager(this.toggleModal.bind(this));
    this.insertChild(this.appRoot);
    this.modal = new RegFormModal(this.onRegister.bind(this));
    this.insertChild(this.modal);
    this.gamePage = import('../pages/game-page/game-page').then(
      ({ default: GamePage }) => new GamePage(this.getAppRoot()),
    );

    const router = new Router(
      [
        {
          name: AppRoutes.DEFAULT,
          controller: import('../pages/reg-page/start-page').then(
            ({ default: AboutPage }) => new AboutPage(this.getAppRoot()),
          ),
        },
        {
          name: AppRoutes.SETTINGS,
          controller: import('../pages/settings-page/settings-page').then(
            ({ default: SettingsPage }) => new SettingsPage(this.getAppRoot()),
          ),
        },
        {
          name: AppRoutes.REPLAY,
          controller: import('../pages/replay-page/replay-page').then(
            ({ default: BestScorePage }) => new BestScorePage(this.getAppRoot()),
          ),
        },
        {
          name: AppRoutes.GAME,
          controller: this.gamePage,
        },
        {
          name: AppRoutes.WATCH,
          controller: import('../pages/replay-page/replay-page').then(
            ({ default: ReplayPage }) => new ReplayPage(this.getAppRoot()),
          ),
        },
      ],
      this.moveToPage.bind(this),
    );
    router.hashChanged();
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
    (await this.gamePage).endGame();
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  async offerDraw(): Promise<void> {
    if (store.getState().gameMode.currentGameMode === GameMode.MULTIPLAYER) {
      socketService.suggestDraw();
    }
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  startGame(): void {
    window.location.hash = '#game';
    this.headerStateManager.transitionToStopGameState(
      async () => this.offerLooseGame(),
      async () => this.offerDraw(),
    );
  }
}
