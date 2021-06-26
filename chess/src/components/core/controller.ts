import PageController from '../../interfaces/page';
import User from '../../interfaces/user';
import UserDaoService from '../../models/user-dao-service';
import BaseComponent from '../base-component';
import BestScorePage from '../pages/best-score-page/best-score-page';
import GamePage from '../pages/game-page/game-page';
import AboutPage from '../pages/reg-page/about-page';
import RegFormModal from '../pages/reg-page/regform-window';
import SettingsPage from '../pages/settings-page/settings-page';
import Router from './router';
import HeaderStateManager from './state-manager';

export default class Controller extends BaseComponent {
  private appRoot: BaseComponent;

  private router: Router;

  private modal: RegFormModal;

  private userModel: UserDaoService;

  private headerStateManager: HeaderStateManager;

  constructor() {
    super('div', ['app']);

    this.appRoot = new BaseComponent('div', ['page']);

    this.userModel = UserDaoService.getInstance();
    this.headerStateManager = new HeaderStateManager(this.toggleModal.bind(this));
    this.insertChild(this.appRoot);
    this.modal = new RegFormModal(this.onRegister.bind(this));
    this.insertChild(this.modal);

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
          name: 'bestscore',
          controller: new BestScorePage(this.getAppRoot()),
        },
        {
          name: 'game',
          controller: new GamePage(this.getAppRoot()),
        },
      ],
      this.moveToPage.bind(this),
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

  async stopGame(): Promise<void> {
    window.location.hash = '#default';
    this.headerStateManager.transitionToRegisteredState(
      this.startGame.bind(this),
      await this.userModel.getAvatar(),
    );
  }

  startGame(): void {
    window.location.hash = '#game';
    this.headerStateManager.transitionToStopGameState(this.stopGame.bind(this));
  }
}
