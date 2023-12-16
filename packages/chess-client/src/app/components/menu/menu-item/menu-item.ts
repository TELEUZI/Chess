import './menu-item.scss';
import BaseComponent from '../../base-component';
import Link from '../../link/link';
import Icon from '../icon/icon';

export default class MenuItem extends BaseComponent<'li'> {
  private readonly icon: Icon;

  private readonly link: Link;

  private readonly href: string;

  constructor(textContent: string, href: string, iconClass = '') {
    super({ tag: 'li', className: 'menu__item' });
    this.href = href;
    this.link = new Link(textContent, href);
    this.icon = new Icon(['menu-icon', iconClass]);
    this.append(this.icon);
    this.append(this.link);
  }

  public getHref(): string {
    return this.href;
  }
}
