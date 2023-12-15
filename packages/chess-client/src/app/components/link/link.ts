import './link.scss';
import BaseComponent from '../base-component';

export default class Link extends BaseComponent<'a'> {
  constructor(
    textContent: string,
    href: string,
    public onClick: () => void = () => {},
  ) {
    super({ tag: 'a', className: 'link', content: textContent });
    this.setAttribute('href', href);
    this.node.onclick = () => {
      this.onClick();
    };
  }
}
