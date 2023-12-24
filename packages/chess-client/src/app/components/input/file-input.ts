import { customElement } from 'lit/decorators.js';
import Input, * as input from './input';

@customElement('c-file-input')
export default class FileInput extends Input {
  constructor(type: input.InputType, classlist: string[], placeholder: string, accept: string) {
    super(type, classlist, placeholder, '');
    this.setAttribute('accept', accept);
  }

  public getFile(): File | null {
    return this.input.value?.files?.[0] ?? null;
  }
}
