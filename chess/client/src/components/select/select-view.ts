import BaseComponent from '../base-component';

export default class SelectView extends BaseComponent {
  options: HTMLOptionElement[];

  onChange: () => void;

  private select: HTMLSelectElement;

  constructor(options: string[]) {
    super('select', ['select', 'select-multiple'], '');
    this.select = <HTMLSelectElement>this.node;
    this.options = options.map((option) => {
      const opt = document.createElement('option');
      opt.classList.add('option');
      opt.value = option;
      opt.innerText = option;
      return opt;
    });
    this.options.forEach((option) => this.select.appendChild(option));
    this.select.addEventListener('change', () => this.onChange());
    this.setAttribute('multiple', 'true');
  }

  getValue(): string {
    return this.select.value;
  }
}
