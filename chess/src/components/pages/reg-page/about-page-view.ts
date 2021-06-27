import BaseComponent from '../../base-component';
import Button from '../../button/button';
import PlayerContainer from './reg-page__components/player-control';

export default class StartPageView extends BaseComponent {
  playerOne: PlayerContainer;

  playerTwo: PlayerContainer;

  startGameWithBot: Button;

  startButton: Button;

  gameModeButton: Button;

  gameControlButtons: BaseComponent;

  constructor() {
    super('div', ['reg-page']);
    this.gameControlButtons = new BaseComponent('div', ['game-control']);
    this.startButton = new Button('Play offline');
    this.gameModeButton = new Button('Play online');
    this.startGameWithBot = new Button('Play with computer');
    this.gameControlButtons.insertChilds([
      this.startButton,
      this.gameModeButton,
      this.startGameWithBot,
    ]);
    this.playerOne = new PlayerContainer('Player 1');
    this.playerTwo = new PlayerContainer('Player 2');
    this.insertChilds([this.playerOne, this.gameControlButtons, this.playerTwo]);
  }
}
