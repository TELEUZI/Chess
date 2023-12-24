import BaseComponent from '@components/base-component';
import Button from '@components/button/button';
import PlayerContainer from '@client/app/pages/reg-page/components/player-control';

export default class StartPageView extends BaseComponent {
  public readonly playerOne: PlayerContainer;

  constructor(
    onStartSingleGame: () => void,

    onStartGameWithBot: () => void,

    onStartMultiplayerGame: () => void,

    onUserNameChanged: (firstUserName: string, secondUserName: string) => void,
  ) {
    super({ className: 'reg-page' });
    const startButton = new Button('Play offline', () => {
      onStartSingleGame();
    });
    const gameModeButton = new Button('Play online', () => {
      onStartMultiplayerGame();
    });
    const startGameWithBot = new Button('Play with computer', () => {
      onStartGameWithBot();
    });
    const gameControlButtons = new BaseComponent({
      className: 'game-control',
      children: [startButton, gameModeButton, startGameWithBot],
    });
    this.playerOne = new PlayerContainer('Player 1', true, (name: string) => {
      onUserNameChanged(name, this.playerOne.getUserName());
    });
    const playerTwo = new PlayerContainer('Player 2', true, (name: string) => {
      onUserNameChanged(playerTwo.getUserName(), name);
    });
    this.appendChildren([this.playerOne.getNode(), gameControlButtons, playerTwo.getNode()]);
  }

  public getCurrentPlayerName(): string {
    return this.playerOne.getUserName();
  }
}
