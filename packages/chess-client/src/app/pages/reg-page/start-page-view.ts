import BaseComponent from '@components/base-component';
import Button from '@components/button/button';
import PlayerContainer from '@client/app/pages/reg-page/components/player-control';

export default class StartPageView extends BaseComponent {
  public readonly playerOne: PlayerContainer;

  public readonly playerTwo: PlayerContainer;

  public readonly startGameWithBot: Button;

  public readonly startButton: Button;

  public readonly gameModeButton: Button;

  public readonly gameControlButtons: BaseComponent;

  constructor(
    private readonly onStartSingleGame: () => void,

    private readonly onStartGameWithBot: () => void,

    private readonly onStartMultiplayerGame: () => void,

    private readonly onUserNameChanged: (firstUserName: string, secondUserName: string) => void,
  ) {
    super({ className: 'reg-page' });
    this.startButton = new Button('Play offline', () => {
      this.onStartSingleGame();
    });
    this.gameModeButton = new Button('Play online', () => {
      this.onStartMultiplayerGame();
    });
    this.startGameWithBot = new Button('Play with computer', () => {
      this.onStartGameWithBot();
    });
    this.gameControlButtons = new BaseComponent({
      className: 'game-control',
      children: [this.startButton, this.gameModeButton, this.startGameWithBot],
    });
    this.playerOne = new PlayerContainer('Player 1', true, (name: string) => {
      this.onUserNameChanged(name, this.playerOne.getUserName());
    });
    this.playerTwo = new PlayerContainer('Player 2', true, (name: string) => {
      this.onUserNameChanged(this.playerTwo.getUserName(), name);
    });
    this.appendChildren([this.playerOne, this.gameControlButtons, this.playerTwo]);
  }
}
