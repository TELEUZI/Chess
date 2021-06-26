import './button.scss';
import BaseComponent from '../base-component';
import ClickElement from '../../interfaces/click-elem';

export default class Button extends BaseComponent implements ClickElement {
  onClick: () => void = () => {};

  constructor(textContent: string, buttonClasses?: string[], onClick: () => void = () => {}) {
    super('button', ['button', ...(buttonClasses || [])], textContent);
    this.node.onclick = () => onClick();
  }
}
