import BaseComponent from '../../../base-component';
import Button from '../../../button/button';

export default class GameControlButtons extends BaseComponent {
  startButton: Button;

  gameModeButton: Button;

  startGameWithBot: Button;

  stopButton: BaseComponent;

  constructor() {
    super('div', ['game-controls']);
    this.startButton = new Button('Play offline');
    this.gameModeButton = new Button('Play online');
    this.startGameWithBot = new Button('Play with computer');
    this.insertChilds([this.startButton, this.gameModeButton, this.startGameWithBot]);
  }
}
