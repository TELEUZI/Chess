import type { PageController, User } from '@chess/game-common';
import { AppRoutes, GameMode } from '@chess/game-common';
import BaseComponent from '@components/base-component';
import { socketService, storeService } from '@chess/game-engine';
import { UserDaoService } from '@chess/dao';
import type GamePage from '../pages/game-page';
import RegFormModal from '../pages/reg-page/regform-window';
import HeaderStateManager from './state-manager';
import Router from './router';

function createAppRoutes(
  root: HTMLElement,
  gamePage: Promise<GamePage>,
): { name: AppRoutes; controller: Promise<PageController> }[] {
  return [
    {
      name: AppRoutes.DEFAULT,
      controller: import('../pages/reg-page').then(({ default: AboutPage }) => new AboutPage(root)),
    },
    {
      name: AppRoutes.SETTINGS,
      controller: import('../pages/settings-page').then(
        ({ default: SettingsPage }) => new SettingsPage(root),
      ),
    },
    {
      name: AppRoutes.REPLAY,
      controller: import('../pages/best-score-page').then(
        ({ default: BestScorePage }) => new BestScorePage(root),
      ),
    },
    {
      name: AppRoutes.GAME,
      controller: gamePage,
    },
    {
      name: AppRoutes.WATCH,
      controller: import('../pages/replay-page').then(
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
    this.modal = new RegFormModal(this.onRegister.bind(this));
    this.appendChildren([this.appRoot, this.modal]);
    this.gamePage = import('../pages/game-page').then(
      ({ default: GamePage }) => new GamePage(this.getAppRoot()),
    );

    const router = new Router(
      createAppRoutes(this.getAppRoot(), this.gamePage),
      this.moveToPage.bind(this),
    );
    router.hashChanged();
  }

  private toggleModal(): void {
    this.modal.toggleClass('hidden');
  }

  private moveToPage(page: PageController): void {
    this.render(page);
  }

  private render(page: PageController): void {
    this.appRoot.destroyChildren();
    this.appRoot.setInnerHTML('');
    this.getNode().prepend(this.headerStateManager.getHeaderNode());
    page.createPage();
  }

  private getAppRoot(): HTMLElement {
    return this.appRoot.getNode();
  }

  private async onRegister(user: User): Promise<void> {
    await this.userModel.setData(user);
    this.modal.toggleModal();
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  private async offerLooseGame(): Promise<void> {
    window.location.hash = '#default';
    if (storeService.getGameMode() === GameMode.MULTIPLAYER) {
      await socketService.endGame('end');
    }
    (await this.gamePage).endGame();
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  private async offerDraw(): Promise<void> {
    if (storeService.getGameMode() === GameMode.MULTIPLAYER) {
      await socketService.suggestDraw();
    }
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  private startGame(): void {
    window.location.hash = '#game';
    this.headerStateManager.transitionToStopGameState(
      () => this.offerLooseGame(),
      () => this.offerDraw(),
    );
  }
}
