import Button from '../../button/button';
import Header from '../header';
import State from './state';

export default class StopGameState extends State<Header> {
  public createButton(onButtonClick?: () => void): void {
    this.context.removeButton();
    this.context.button = new Button('Stop Game', [], onButtonClick);
    this.context.insertChild(this.context.button);
  }
}
