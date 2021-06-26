import './link.scss';
import BaseComponent from '../base-component';
import ClickElement from '../../interfaces/click-elem';

export default class Link extends BaseComponent implements ClickElement {
  onClick: () => void = () => {};

  constructor(textContent: string, href: string, onClick?: () => void) {
    super('a', ['link'], textContent);
    this.setAttribute('href', href);
    this.onClick = onClick;
    this.node.onclick = () => this.onClick?.();
  }
}
