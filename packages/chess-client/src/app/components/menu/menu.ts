import './menu.scss';
import { AppRoutes } from '@chess/game-common';
import BaseComponent from '../base-component';
import MenuItem from './menu-item/menu-item';

export default class Menu extends BaseComponent<'ul'> {
  private readonly items: MenuItem[] = [];

  constructor() {
    super({ tag: 'ul', className: 'menu' });
    this.items.push(
      new MenuItem('Lobby', `#${AppRoutes.DEFAULT}`, 'lobby-icon'),
      new MenuItem('Replay', `#${AppRoutes.REPLAY}`, 'replay-icon'),
      new MenuItem('Game Settings', `#${AppRoutes.SETTINGS}`, 'settings-icon'),
    );
    this.items.forEach((el) => {
      this.append(el);
    });
  }
}
