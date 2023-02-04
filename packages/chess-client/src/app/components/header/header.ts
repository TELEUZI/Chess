import './header.scss';
import BaseComponent from '../base-component';
import Button from '../button/button';
import Menu from '../menu/menu';
import type State from './header-states/state';
import BASE_LOGO from '../../../assets/icons/ava.png';

export default class Header extends BaseComponent {
  private state: State<Header>;

  private readonly menu: Menu;

  firstControlButton: Button;

  secondControlButton: Button;

  private avatar: HTMLImageElement;

  constructor(state: State<Header>, onButtonClick?: () => void) {
    super('header', ['header']);
    this.state = state;
    this.transitionTo(this.state);
    this.createButton(onButtonClick);
    this.menu = new Menu();
    this.createAvatar();
    this.insertChilds([this.menu, this.firstControlButton]);
    this.secondControlButton = new Button('', onButtonClick);
  }

  public transitionTo(state: State<Header>): void {
    this.state = state;
    this.state.setContext(this);
  }

  createButton(
    onFirstButtonClick?: () => void,
    onSecondButtonClick?: () => void,
    avatar?: string,
  ): void {
    this.state.createButton(onFirstButtonClick, onSecondButtonClick, avatar);
  }

  createAvatar(): void {
    this.avatar = new Image();
    this.avatar.src = BASE_LOGO;
    this.avatar.classList.add('avatar');
    this.node.append(this.avatar);
  }

  setAvatarSrc(src: string): void {
    this.avatar.src = src;
  }

  removeButtons(): void {
    this.firstControlButton.destroy();
    this.secondControlButton.destroy();
  }
}
