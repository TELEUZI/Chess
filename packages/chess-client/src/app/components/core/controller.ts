import RegFormModal from '../../pages/reg-page/regform-window';
import store from '../../pages/game-page/chess-game/state/redux/store';
import type GamePage from '../../pages/game-page/game-page';
import type PageController from '../../interfaces/page';
import type User from '../../interfaces/user';

import BaseComponent from '../base-component';
import Router from './router';
import HeaderStateManager from './state-manager';
import UserDaoService from '../../services/user-dao-service';
import GameMode from '../../enums/game-mode';
import { socketService } from '../../services/websocket-service';
import AppRoutes from '../../enums/app-routes';

function createAppRoutes(root: HTMLElement, gamePage: Promise<GamePage>) {
  return [
    {
      name: AppRoutes.DEFAULT,
      controller: import('../../pages/reg-page/start-page').then(
        ({ default: AboutPage }) => new AboutPage(root),
      ),
    },
    {
      name: AppRoutes.SETTINGS,
      controller: import('../../pages/settings-page/settings-page').then(
        ({ default: SettingsPage }) => new SettingsPage(root),
      ),
    },
    {
      name: AppRoutes.REPLAY,
      controller: import('../../pages/best-score-page/best-score-page').then(
        ({ default: BestScorePage }) => new BestScorePage(root),
      ),
    },
    {
      name: AppRoutes.GAME,
      controller: gamePage,
    },
    {
      name: AppRoutes.WATCH,
      controller: import('../../pages/replay-page/replay-page').then(
        ({ default: ReplayPage }) => new ReplayPage(root),
      ),
    },
  ];
}

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent;

  private readonly modal: RegFormModal;

  private readonly userModel: UserDaoService;

  private readonly headerStateManager: HeaderStateManager;

  private readonly gamePage: Promise<GamePage>;

  constructor() {
    super({ className: 'app' });
    this.appRoot = new BaseComponent({ className: 'page' });
    this.userModel = UserDaoService.getInstance();
    this.headerStateManager = new HeaderStateManager(() => {
      this.toggleModal();
    });
    this.append(this.appRoot);
    this.modal = new RegFormModal(this.onRegister.bind(this));
    this.append(this.modal);
    this.gamePage = import('../../pages/game-page/game-page').then(
      ({ default: GamePage }) => new GamePage(this.getAppRoot()),
    );

    const router = new Router(
      createAppRoutes(this.getAppRoot(), this.gamePage),
      this.moveToPage.bind(this),
    );
    router.hashChanged();
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
      await socketService.endGame('end');
    }
    (await this.gamePage).endGame();
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  async offerDraw(): Promise<void> {
    if (store.getState().gameMode.currentGameMode === GameMode.MULTIPLAYER) {
      await socketService.suggestDraw();
    }
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
