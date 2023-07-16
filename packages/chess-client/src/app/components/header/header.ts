import './header.scss';
import BaseComponent from '../base-component';
import Button from '../button/button';
import Menu from '../menu/menu';
import type State from './header-states/state';
import BASE_LOGO from '../../../assets/icons/ava.png';

export default class Header extends BaseComponent {
  private state: State<Header>;

  private readonly menu: Menu;

  private readonly avatar: HTMLImageElement;

  public firstControlButton?: Button;

  public secondControlButton: Button;

  constructor(state: State<Header>, onButtonClick?: () => void) {
    super('header', ['header']);
    this.state = state;
    this.transitionTo(this.state);
    this.createButton({ onFirstButtonClick: onButtonClick });
    this.menu = new Menu();
    this.avatar = this.createAvatar();
    this.node.append(this.avatar);
    this.insertChilds([this.menu, this.firstControlButton]);
    this.secondControlButton = new Button('', onButtonClick);
  }

  public transitionTo(state: State<Header>): void {
    this.state = state;
    this.state.setContext(this);
  }

  createButton({
    onFirstButtonClick,
    onSecondButtonClick,
    avatar,
  }: {
    onFirstButtonClick?: () => void;
    onSecondButtonClick?: () => void;
    avatar?: ArrayBuffer | string;
  }): void {
    this.state.createButton({ onFirstButtonClick, onSecondButtonClick, avatar });
  }

  createAvatar(): HTMLImageElement {
    const avatar = new Image();
    avatar.src = BASE_LOGO;
    avatar.classList.add('avatar');
    return avatar;
  }

  setAvatarSrc(src: string): void {
    this.avatar.src = src;
  }

  removeButtons(): void {
    this.firstControlButton?.destroy();
    this.secondControlButton.destroy();
  }
}
