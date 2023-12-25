import type { PageController, User } from '@chess/game-common';
import { GameMode } from '@chess/game-common';
import BaseComponent from '@components/base-component';
import { socketService, storeService } from '@chess/game-engine';
import { UserDaoService } from '@chess/dao';
import type GamePage from '../pages/game-page';
import RegFormModal from '../pages/reg-page/regform-window';
import { Router, createAppRoutes } from './router';
import Header from '../components/header/header';

export default class Controller extends BaseComponent {
  private readonly appRoot: BaseComponent;

  private readonly modal: RegFormModal;

  private readonly userModel: UserDaoService;

  private readonly header: Header;

  private readonly gamePage: Promise<GamePage>;

  constructor() {
    super({ className: 'app' });
    this.appRoot = new BaseComponent({ className: 'page' });
    this.userModel = UserDaoService.getInstance();
    this.header = new Header(
      () => {
        window.location.hash = '#game';
        this.header.setState({ isRegistered: true, isGameActive: true });
      },
      () => this.offerLooseGame(),
      () => this.offerDraw(),
      () => {
        this.toggleModal();
      },
    );
    this.modal = new RegFormModal(this.onRegister.bind(this));
    this.appendChildren([this.appRoot, this.modal]);
    this.gamePage = import('../pages/game-page').then(
      ({ default: GamePage }) => new GamePage(this.getAppRoot()),
    );
    this.append(this.header.getNode());

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
    this.getNode().prepend(this.header.getNode());
    page.createPage();
  }

  private getAppRoot(): HTMLElement {
    return this.appRoot.getNode();
  }

  private async onRegister(user: User): Promise<void> {
    await this.userModel.setData(user);
    this.modal.toggleModal();
    this.header.setAvatarSrc(await this.userModel.getAvatar());
    this.header.setState({ isRegistered: true, isGameActive: false });
  }

  private async offerLooseGame(): Promise<void> {
    window.location.hash = '#default';
    if (storeService.getGameMode() === GameMode.MULTIPLAYER) {
      await socketService.endGame('end');
    }
    (await this.gamePage).endGame();
    this.header.setState({ isRegistered: true, isGameActive: false });
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/class-methods-use-this
  private async offerDraw(): Promise<void> {
    if (storeService.getGameMode() === GameMode.MULTIPLAYER) {
      await socketService.suggestDraw();
    }
    // this.headerStateManager.transitionToRegisteredState(
    //   this.startGame.bind(this),
    //   await this.userModel.getAvatar(),
    // );
  }
}
