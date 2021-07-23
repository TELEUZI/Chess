import Icon from '../icon/icon';
import Link from '../../link/link';
import BaseComponent from '../../base-component';

export default class Logo extends BaseComponent {
  private link: Link;

  private icon: Icon;

  constructor(iconClass: string[]) {
    super();
    this.icon = new Icon(iconClass);
    this.link = new Link('', `#default`);
    this.link.insertChild(this.icon);
    this.insertChild(this.link);
  }
}
