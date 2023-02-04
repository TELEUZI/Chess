import BaseComponent from '../../base-component';
import Button from '../../button/button';
import PlayerContainer from './reg-page__components/player-control';

export default class StartPageView extends BaseComponent {
  playerOne: PlayerContainer;

  playerTwo: PlayerContainer;

  private readonly startGameWithBot: Button;

  private readonly startButton: Button;

  private readonly gameModeButton: Button;

  private readonly gameControlButtons: BaseComponent;

  onStartSingleGame: () => void;

  onStartGameWithBot: () => void;

  onStartMultiplayerGame: () => void;

  onUserNameChanged: (firstUserName: string, secondtUserName: string) => void;

  constructor() {
    super('div', ['reg-page']);
    this.gameControlButtons = new BaseComponent('div', ['game-control']);
    this.startButton = new Button('Play offline', () => {
      this.onStartSingleGame();
    });
    this.gameModeButton = new Button('Play online', () => {
      this.onStartMultiplayerGame();
    });
    this.startGameWithBot = new Button('Play with computer', () => {
      this.onStartGameWithBot();
    });
    this.gameControlButtons.insertChilds([
      this.startButton,
      this.gameModeButton,
      this.startGameWithBot,
    ]);
    this.playerOne = new PlayerContainer('Player 1', true);
    this.playerTwo = new PlayerContainer('Player 2', true);
    this.setUpListeners();
    this.insertChilds([this.playerOne, this.gameControlButtons, this.playerTwo]);
  }

  setUpListeners(): void {
    this.playerOne.onSubmit = (name: string) => {
      this.onUserNameChanged(name, this.playerOne.getUserName());
    };
    this.playerTwo.onSubmit = (name: string) => {
      this.onUserNameChanged(this.playerTwo.getUserName(), name);
    };
  }
}
