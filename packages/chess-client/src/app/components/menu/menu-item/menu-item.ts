import './menu-item.scss';
import BaseComponent from '../../base-component';
import Icon from '../icon/icon';
import Link from '../../link/link';

export default class MenuItem extends BaseComponent<'li'> {
  private readonly href: string;

  constructor(textContent: string, href: string, iconClass = '') {
    super({ tag: 'li', className: 'menu__item' });
    this.href = href;
    const link = new Link(textContent, href);
    const icon = new Icon(['menu-icon', iconClass]);
    this.append(icon);
    this.append(link);
  }

  public getHref(): string {
    return this.href;
  }
}
