import Header from '../header/header';
import RegisterState from '../header/header-states/register-state';
import StartGameState from '../header/header-states/start-game-state';
import StopGameState from '../header/header-states/stop-game-state';

export default class HeaderStateManager {
  private header: Header;

  constructor(onRegisterUser: () => void) {
    this.header = new Header(new RegisterState(), onRegisterUser);
  }

  async transitionToRegisteredState(onStartGame: () => void, avatarImage: string): Promise<void> {
    this.header.transitionTo(new StartGameState());
    this.header.createButton(onStartGame, avatarImage);
  }

  transitionToStopGameState(onStopGame: () => void): void {
    this.header.transitionTo(new StopGameState());
    this.header.createButton(onStopGame);
  }

  getHeaderNode(): HTMLElement {
    return this.header.getNode();
  }
}
