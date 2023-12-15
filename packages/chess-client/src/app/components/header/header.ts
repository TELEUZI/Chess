import BASE_LOGO from '../../../assets/icons/ava.png';
import s from './header.module.scss';
import BaseComponent from '../base-component';
import Button from '../button/button';
import Menu from '../menu/menu';
import type State from './header-states/state';

const createAvatar = (): HTMLImageElement => {
  const avatar = new Image();
  avatar.src = BASE_LOGO;
  avatar.classList.add('avatar');
  return avatar;
};

export default class Header extends BaseComponent<'header'> {
  private state: State<Header>;

  private readonly menu: Menu;

  private readonly avatar: HTMLImageElement;

  public firstControlButton?: Button;

  public secondControlButton: Button;

  constructor(state: State<Header>, onButtonClick?: () => void) {
    super({ tag: 'header', className: s.header });
    this.state = state;
    this.transitionTo(this.state);
    this.createButton({ onFirstButtonClick: onButtonClick });
    this.menu = new Menu();
    this.avatar = createAvatar();
    this.node.append(this.avatar);
    this.append(this.menu);
    if (this.firstControlButton) {
      this.append(this.firstControlButton);
    }
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

  setAvatarSrc(src: string): void {
    this.avatar.src = src;
  }

  removeButtons(): void {
    this.firstControlButton?.destroy();
    this.secondControlButton.destroy();
  }
}
