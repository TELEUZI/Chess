import BaseComponent from '../base-component';
import './input.scss';

enum ValidType {
  valid = 'valid',
  invalid = 'invalid',
}
export default class Input extends BaseComponent<'input'> {
  public onInput?: (input: HTMLInputElement) => boolean;

  public isValid = true;

  protected input: HTMLInputElement;

  constructor(type: string, classlist: string[], placeholder = '', value?: number | string) {
    super({ tag: 'input', className: ['input', ...classlist].join(' ') });
    this.input = this.node;
    this.setAttributes(type, placeholder, value);
    this.createListeners();
  }

  public setHandler(handler: (input: HTMLInputElement) => boolean): void {
    this.onInput = handler;
  }

  public checkValidation(): void {
    if (this.onInput) {
      this.input.reportValidity();
      this.isValid = this.onInput(this.input);
      this.input.classList.add(this.isValid ? ValidType.valid : ValidType.invalid);
      this.input.classList.remove(this.isValid ? ValidType.invalid : ValidType.valid);
    }
  }

  public setAttributes(type: string, placeholder: string, value?: number | string): void {
    this.setAttribute('type', type);
    this.setAttribute('placeholder', placeholder);
    if (value != null) {
      this.setAttribute('value', value.toString());
    }
  }

  public createListeners(): void {
    this.input.addEventListener('input', () => {
      this.checkValidation();
    });
    this.input.addEventListener('invalid', () => {}, false);
  }

  public getValue(): string {
    return this.input.value;
  }

  public setValue(value: string): void {
    this.input.value = value;
  }
}
