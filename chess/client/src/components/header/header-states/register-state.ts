import Button from '../../button/button';
import Header from '../header';
import State from './state';

export default class RegisterState extends State<Header> {
  public createButton(onButtonClick?: () => void): void {
    this.context.firstControlButton = new Button('Register', onButtonClick);
  }
}
