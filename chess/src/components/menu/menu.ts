import './menu.scss';
import BaseComponent from '../base-component';
import MenuItem from './menu-item/menu-item';

export default class Menu extends BaseComponent {
  private items: MenuItem[] = [];

  constructor() {
    super('ul', ['menu'], '');
    this.items.push(
      new MenuItem('About Game', '#default', 'question-icon'),
      new MenuItem('Best Score', '#bestscore', 'best-icon'),
      new MenuItem('Game Settings', '#settings', 'settings-icon'),
    );
    this.items.map((el) => this.insertChild(el));
  }

  setCurrent(tabName: string): void {
    this.items.find((item) => item.getHref() === tabName).toggleClass('current');
  }
}
