import type { TemplateResult } from 'lit-html';
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import './input.scss';
import { html, css, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { customElement, property } from 'lit/decorators.js';

const enum ValidType {
  valid = 'valid',
  invalid = 'invalid',
}
export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'datetime'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

@customElement('c-input')
export default class Input extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    :host {
      display: inline-block;
      position: relative;
    }
    .invalid {
      border: 2px solid red;
    }

    .valid {
      border: 2px solid green;
    }
  `;

  @property({ type: String }) value = '';

  @property({ type: Boolean })
  isValid = true;

  @property()
  classes: Record<string, boolean>;

  @property({ type: Boolean })
  disabled = false;

  onInput?: (input: HTMLInputElement) => boolean;

  input = createRef<HTMLInputElement>();

  constructor(
    private readonly type: InputType,
    classlist: string[],
    private readonly placeholder = '',
    defaultValue = '',
  ) {
    super();
    this.classes = {
      [ValidType.valid]: this.isValid,
      [ValidType.invalid]: !this.isValid,
      input: true,
      ...classlist.reduce((acc, className) => ({ ...acc, [className]: true }), {}),
    };
    this.value = defaultValue;
  }

  setHandler(handler: (input: HTMLInputElement) => boolean): void {
    this.onInput = handler;
  }

  checkValidation(): void {
    if (this.onInput && this.input.value != null) {
      this.input.value.reportValidity();
      this.isValid = this.onInput(this.input.value);
      console.log(this.isValid, this.input.value.value);
    }
  }

  getValue(): string {
    return this.input.value?.value ?? '';
  }

  setValue(value: string): void {
    this.value = value;
  }

  render(): TemplateResult {
    const inputClasses = {
      ...this.classes,
      [ValidType.valid]: this.isValid,
      [ValidType.invalid]: !this.isValid,
    };
    return html`
      <input
        class=${classMap(inputClasses)}
        type="${this.type}"
        placeholder="${this.placeholder}"
        .disabled="${this.disabled}"
        .value="${this.value}"
        ${ref(this.input)}
        @input="${() => {
          this.checkValidation();
        }}"
        @invalid="${() => {}}"
      />
    `;
  }
}
