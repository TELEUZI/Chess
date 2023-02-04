import Button from '../../button/button';
import type Header from '../header';
import State from './state';

export default class StopGameState extends State<Header> {
  public createButton(onButtonClick?: () => void, onSecondButtonClick?: () => void): void {
    this.context.removeButtons();
    this.context.firstControlButton = new Button('Admit Loose', onButtonClick);
    this.context.secondControlButton = new Button('Offer a draw', onSecondButtonClick);
    this.context.insertChilds([this.context.firstControlButton, this.context.secondControlButton]);
  }
}
