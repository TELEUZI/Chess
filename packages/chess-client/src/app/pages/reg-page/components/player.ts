import { BaseLitComponent } from '@client/app/components/base-component';
import type Input from '@client/app/components/input/input';
import type { ReadonlySignal } from '@preact/signals-core';
import { effect } from '@preact/signals-core';
import type { TemplateResult } from 'lit-html';
import { html } from 'lit-html';
import { createRef, ref } from 'lit-html/directives/ref.js';

export default class PlayerView extends BaseLitComponent {
  private readonly userNameInput = createRef<Input>();

  constructor(
    private readonly name: ReadonlySignal<string>,
    private readonly isUpdateMode: ReadonlySignal<boolean>,
  ) {
    super({ className: 'user' });
    effect(() => {
      this.render(this.getTemplate());
    });
  }

  public getTemplate(): TemplateResult {
    return html`<div class="user__info">
      <label class="user__name ${this.isUpdateMode.value ? 'hidden' : ''}"
        >${this.name.value}</label
      >
      <c-input
        ${ref(this.userNameInput)}
        .value="${this.name.value}"
        type="text"
        class="user__name-input ${this.isUpdateMode.value ? '' : 'hidden'}"
      ></c-input>
    </div>`;
  }

  public getValue(): string {
    return this.userNameInput.value?.getValue() ?? '';
  }
}
