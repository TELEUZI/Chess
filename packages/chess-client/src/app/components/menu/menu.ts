import './menu.scss';
import BaseComponent from '../base-component';
import MenuItem from './menu-item/menu-item';
import AppRoutes from '../../enums/app-routes';

export default class Menu extends BaseComponent {
  private readonly items: MenuItem[] = [];

  constructor() {
    super('ul', ['menu'], '');
    this.items.push(
      new MenuItem('Lobby', `#${AppRoutes.DEFAULT}`, 'lobby-icon'),
      new MenuItem('Replay', `#${AppRoutes.REPLAY}`, 'replay-icon'),
      new MenuItem('Game Settings', `#${AppRoutes.SETTINGS}`, 'settings-icon'),
    );
    this.items.forEach((el) => {
      this.insertChild(el);
    });
  }
}
