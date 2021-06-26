import BaseComponent from '../../base-component';
import GameControlButtons from './reg-page__components/game-controls';
import PlayerContainer from './reg-page__components/player-control';

export default class AboutPageView extends BaseComponent {
  gameControlButtons: GameControlButtons;

  playerOne: PlayerContainer;

  playerTwo: PlayerContainer;

  constructor() {
    super('div', ['regPage']);
    this.gameControlButtons = new GameControlButtons();
    this.playerOne = new PlayerContainer('Player 1');
    this.playerTwo = new PlayerContainer('Player 2');

    this.insertChilds([this.playerOne, this.gameControlButtons, this.playerTwo]);
  }
}
