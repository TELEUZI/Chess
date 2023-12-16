import BASE_LOGO from '../../../../assets/icons/ava.png';
import State from './state';
import Button from '../../button/button';
import type Header from '../header';

export default class StartGameState extends State<Header> {
  public createButton({
    onFirstButtonClick: onButtonClick,
    avatar,
  }: {
    onFirstButtonClick?: () => void;
    onSecondButtonClick?: () => void;
    avatar?: string;
  }): void {
    if (this.context) {
      this.context.setAvatarSrc(avatar ?? BASE_LOGO);
      this.context.removeButtons();
      this.context.firstControlButton = new Button('Start Game', onButtonClick);
      this.context.append(this.context.firstControlButton);
    }
  }
}
