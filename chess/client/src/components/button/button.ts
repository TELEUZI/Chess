import './button.scss';
import BaseComponent from '../base-component';
import ClickElement from '../../interfaces/click-elem';

export default class Button extends BaseComponent implements ClickElement {
  onClick: () => void = () => {};

  constructor(textContent: string, onClick: () => void = () => {}, buttonClasses?: string[]) {
    super('button', ['button', ...(buttonClasses || [])], textContent);
    this.onClick = onClick;
    this.node.onclick = () => this.onClick();
  }
}
