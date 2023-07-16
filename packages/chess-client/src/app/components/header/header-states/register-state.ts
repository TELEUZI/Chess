import Button from '../../button/button';
import type Header from '../header';
import State from './state';

export default class RegisterState extends State<Header> {
  public createButton({
    onFirstButtonClick: onButtonClick,
  }: {
    onFirstButtonClick?: () => void;
    onSecondButtonClick?: () => void;
    avatar?: string;
  }): void {
    if (this.context) {
      this.context.firstControlButton = new Button('Register', onButtonClick);
    }
  }
}
