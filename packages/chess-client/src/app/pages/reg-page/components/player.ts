import { BaseLitComponent } from '@client/app/components/base-component';
import Input from '@client/app/components/input/input';
import type { ReadonlySignal } from '@preact/signals-core';
import { effect } from '@preact/signals-core';
import type { TemplateResult } from 'lit-html';
import { html } from 'lit-html';

export default class PlayerView extends BaseLitComponent {
  private readonly userNameUpdate: Input;

  constructor(
    private readonly name: ReadonlySignal<string>,
    private readonly isUpdateMode: ReadonlySignal<boolean>,
  ) {
    super({ className: 'user' });
    this.userNameUpdate = new Input('text', ['user__name-input'], name.value, name.value);
    effect(() => {
      if (this.isUpdateMode.value) {
        this.userNameUpdate.classList.remove('hidden');
      } else {
        this.userNameUpdate.classList.add('hidden');
      }
      this.render(this.getTemplate());
    });
  }

  public getTemplate(): TemplateResult {
    return html`<div class="user__info">
      <label
        @click="${() => {
          this.increment();
        }}"
        class="user__name ${this.isUpdateMode.value ? 'hidden' : ''}"
        >${this.name.value}</label
      >
      ${this.userNameUpdate}
    </div>`;
  }

  public getValue(): string {
    return this.userNameUpdate.getValue();
  }

  private increment(): void {
    console.log('click', this.name);
  }
}
