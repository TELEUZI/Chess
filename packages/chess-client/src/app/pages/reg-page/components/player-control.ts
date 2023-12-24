import { BaseLitComponent } from '@components/base-component';
import Button from '@components/button/button';
import type { TemplateResult } from 'lit-html';
import { html } from 'lit-html';
import { when } from 'lit-html/directives/when.js';
import { effect, signal, batch } from '@preact/signals-core';
import PlayerView from './player';

export default class PlayerContainer extends BaseLitComponent {
  private readonly player: PlayerView;

  private readonly updateButton = new Button('Update', this.edit.bind(this), ['button_update']);

  private readonly submitButton = new Button('Submit', this.submit.bind(this), ['button_edit']);

  private readonly isUpdateMode = signal(false);

  private readonly name = signal('');

  constructor(
    name: string,
    isUpdatable: boolean,
    private readonly onSubmit?: (name: string) => void,
  ) {
    super({ className: 'player-container' });
    this.name.value = name;
    this.player = new PlayerView(this.name, this.isUpdateMode);
    effect(() => {
      this.render(this.getTemplate(isUpdatable));
    });
  }

  public edit(): void {
    this.isUpdateMode.value = !this.isUpdateMode.value;
  }

  public submit(): void {
    const updatedName = this.player.getValue();
    batch(() => {
      this.isUpdateMode.value = !this.isUpdateMode.value;
      this.name.value = updatedName;
    });
    this.onSubmit?.(updatedName);
  }

  public getUserName(): string {
    return this.name.value;
  }

  public getTemplate(isUpdatable: boolean): TemplateResult {
    return html`
      <div class="avatar">${this.name.value[0].toUpperCase()} ${this.player.getNode()}</div>
      ${this.player.getNode()}
      ${when(isUpdatable, () =>
        when(
          !this.isUpdateMode.value,
          () => this.updateButton.getNode(),
          () => this.submitButton.getNode(),
        ),
      )}
    `;
  }
}
