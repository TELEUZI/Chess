/* eslint-disable no-nested-ternary */
import type { TemplateResult } from 'lit-html';
import { html } from 'lit-html';
import { map } from 'lit-html/directives/map.js';
import type { Signal } from '@preact/signals-core';
import { effect, signal } from '@preact/signals-core';
import BASE_LOGO from '../../../assets/icons/ava.png';
import s from './header.module.scss';
import { BaseLitComponent } from '../base-component';
import Button from '../button/button';
import Menu from '../menu/menu';
import Logo from '../menu/logo/logo';

const createAvatar = (): HTMLImageElement => {
  const avatar = new Image();
  avatar.src = BASE_LOGO;
  avatar.classList.add('avatar');
  return avatar;
};

export default class Header extends BaseLitComponent<'header'> {
  private readonly menu: Menu;

  private readonly avatar: HTMLImageElement;

  private readonly logo = new Logo(['logo']);

  private readonly state: Signal<{ isRegistered: boolean; isGameActive: boolean }> = signal({
    isRegistered: false,
    isGameActive: false,
  });

  constructor(
    private readonly onStartGame: () => void,
    private readonly onLoosed: () => void,
    private readonly onDraw: () => void,
    private readonly onRegister: () => void,
  ) {
    super({ tag: 'header', className: s.header });
    this.menu = new Menu();
    this.avatar = createAvatar();
    effect(() => {
      this.render(this.getTemplate());
    });
  }

  public getTemplate(): TemplateResult {
    return html`
      ${this.logo.getNode()} ${this.menu.getNode()}
      ${this.state.value.isRegistered
        ? this.state.value.isGameActive
          ? map(
              [new Button('Admit Loose', this.onLoosed), new Button('Offer a draw', this.onDraw)],
              (i) => html`${i.getNode()}`,
            )
          : new Button('Start Game', this.onStartGame).getNode()
        : new Button('Register', this.onRegister).getNode()}
      ${this.state.value.isRegistered ? this.avatar : null}
    `;
  }

  public setAvatarSrc(src: ArrayBuffer | string): void {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    this.avatar.src = src.toString();
  }

  public setState(state: { isRegistered: boolean; isGameActive: boolean }): void {
    this.state.value = state;
  }
}
