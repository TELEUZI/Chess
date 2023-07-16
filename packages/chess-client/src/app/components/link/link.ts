import './link.scss';
import BaseComponent from '../base-component';
import type ClickElement from '../../interfaces/click-elem';

export default class Link extends BaseComponent implements ClickElement {
  constructor(textContent: string, href: string, public onClick: () => void = () => {}) {
    super('a', ['link'], textContent);
    this.setAttribute('href', href);
    this.node.onclick = () => {
      this.onClick();
    };
  }
}
