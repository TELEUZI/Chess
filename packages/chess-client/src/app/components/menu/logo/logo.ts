import Icon from '../icon/icon';
import Link from '../../link/link';
import BaseComponent from '../../base-component';

export default class Logo extends BaseComponent {
  private readonly link: Link;

  private readonly icon: Icon;

  constructor(iconClass: string[]) {
    super({});
    this.icon = new Icon(iconClass);
    this.link = new Link('', `#default`);
    this.link.append(this.icon);
    this.append(this.link);
  }
}
