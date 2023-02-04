import BaseComponent from '../base-component';
import './input.scss';

enum ValidType {
  valid = 'valid',
  invalid = 'invalid',
}
export default class Input extends BaseComponent {
  protected input: HTMLInputElement;

  onInput: (input: HTMLInputElement) => boolean;

  isValid: boolean;

  constructor(type: string, classlist: string[], placeholder?: string, value?: number | string) {
    super('input', ['input', ...classlist], '');
    this.input = <HTMLInputElement>this.node;
    this.setAttributes(type, placeholder, value);
    this.createListeners();
  }

  setHandler(handler: (input: HTMLInputElement) => boolean): void {
    this.onInput = handler;
  }

  checkValidation(): void {
    if (this.onInput) {
      this.input.reportValidity();
      this.isValid = this.onInput(this.input);
      this.input.classList.add(this.isValid ? ValidType.valid : ValidType.invalid);
      this.input.classList.remove(this.isValid ? ValidType.invalid : ValidType.valid);
    }
  }

  getFile(): File {
    throw new Error(`${this}`);
  }

  setAttributes(type: string, placeholder: string, value: number | string): void {
    this.setAttribute('type', type);
    this.setAttribute('placeholder', placeholder);
    if (value) {
      this.setAttribute('value', value.toString());
    }
  }

  createListeners(): void {
    this.input.addEventListener('input', () => {
      this.checkValidation();
    });
    this.input.addEventListener('invalid', () => {}, false);
  }

  getValue(): string {
    return this.input.value;
  }

  setValue(value: string): void {
    this.input.value = value;
  }
}
