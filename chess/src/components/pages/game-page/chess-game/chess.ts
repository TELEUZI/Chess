import Vector from './components/vector';

import BaseComponent from '../../../base-component';
import Timer from '../../../timer/timer';
import ChessField from './field/field-controller';

class Chess extends BaseComponent {
  public onCellClick: (coords: Vector) => void = () => {};

  timer: Timer;

  private playerOne: BaseComponent;

  private playerTwo: BaseComponent;

  private chessBoard: ChessField;

  constructor(parentNode: HTMLElement) {
    super('div', ['chess_wrapper'], '', parentNode);
    const chessHead = new BaseComponent('div', ['chess_head'], '', this.node);
    this.playerOne = new BaseComponent('div', ['chess_player'], 'Player1', chessHead.getNode());
    this.timer = new Timer();
    this.node.appendChild(this.timer.getNode());
    this.playerTwo = new BaseComponent('div', ['chess_player'], 'Player2', chessHead.getNode());
    const chessBody = new BaseComponent('div', ['chess_body'], '', this.node);
    this.chessBoard = new ChessField(chessBody.getNode());
    this.playerOne.toggleClass('current');
  }

  nextTurnHandler(): void {
    this.playerOne.toggleClass('current');
    this.playerTwo.toggleClass('current');
  }
}

export default Chess;
