import './header.scss';
import BaseComponent from '../base-component';
import Button from '../button/button';
import Logo from '../menu/logo/logo';
import Menu from '../menu/menu';
import State from './header-states/state';

export default class Header extends BaseComponent {
  private logo: Logo;

  private state: State<Header>;

  private menu: Menu;

  button: Button;

  private avatar: HTMLImageElement;

  onButtonClick: () => void;

  constructor(state: State<Header>, onButtonClick?: () => void) {
    super('header', ['header']);
    this.state = state;
    this.transitionTo(this.state);
    this.createButton(onButtonClick);
    this.logo = new Logo(['logo']);
    this.menu = new Menu();
    this.createAvatar();
    this.insertChilds([this.logo, this.menu, this.button]);
  }

  public transitionTo(state: State<Header>): void {
    this.state = state;
    this.state.setContext(this);
  }

  createButton(onButtonClick?: () => void, avatar?: string): void {
    this.state.createButton(onButtonClick, avatar);
  }

  createAvatar(): void {
    this.avatar = new Image();
    // this.avatar.classList.add('avatar');
    this.node.appendChild(this.avatar);
  }

  setAvatarSrc(src: string): void {
    this.avatar.src = src;
  }

  removeButton(): void {
    this.button.getNode().remove();
  }
}
