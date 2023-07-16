import Header from '../header/header';
import RegisterState from '../header/header-states/register-state';
import StartGameState from '../header/header-states/start-game-state';
import StopGameState from '../header/header-states/stop-game-state';

export default class HeaderStateManager {
  private readonly header: Header;

  constructor(onRegisterUser: () => void) {
    this.header = new Header(new RegisterState(), onRegisterUser);
  }

  transitionToRegisteredState(onStartGame: () => void, avatarImage: ArrayBuffer | string): void {
    this.header.transitionTo(new StartGameState());
    this.header.createButton({
      onFirstButtonClick: onStartGame,
      avatar: avatarImage,
    });
  }

  transitionToStopGameState(onLoose: () => void, onDraw: () => void): void {
    this.header.transitionTo(new StopGameState());
    this.header.createButton({
      onFirstButtonClick: onLoose,
      onSecondButtonClick: onDraw,
    });
  }

  getHeaderNode(): HTMLElement {
    return this.header.getNode();
  }
}
