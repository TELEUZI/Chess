import Button from '../../button/button';
import Header from '../header';
import State from './state';

export default class StopGameState extends State<Header> {
  public createButton(onButtonClick?: () => void, onButtonClick1?: () => void): void {
    this.context.removeButtons();
    this.context.firstControlButton = new Button('Admit Loose', onButtonClick);
    this.context.secondControlButton = new Button('Offer a draw', onButtonClick1);
    this.context.insertChilds([this.context.firstControlButton, this.context.secondControlButton]);
  }
}
