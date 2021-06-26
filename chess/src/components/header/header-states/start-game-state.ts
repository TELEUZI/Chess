import State from './state';
import BASE_LOGO from '../../../assets/icons/ava.png';
import Button from '../../button/button';
import Header from '../header';

export default class StartGameState extends State<Header> {
  public createButton(onButtonClick?: () => void, avatar?: string): void {
    this.context.setAvatarSrc(avatar || BASE_LOGO);
    this.context.removeButton();
    this.context.button = new Button('Start Game', [], onButtonClick);
    this.context.insertChild(this.context.button);
  }
}
