import BaseComponent from '../base-component';

export default class SelectView extends BaseComponent<'select'> {
  private readonly options: HTMLOptionElement[];

  constructor(
    options: string[],
    private readonly onChange: () => void,
  ) {
    super({ tag: 'select', className: 'select select-multiple' });
    this.options = options.map((option) => {
      const opt = document.createElement('option');
      opt.classList.add('option');
      opt.value = option;
      opt.textContent = option;
      return opt;
    });
    this.options.forEach((option) => {
      this.node.append(option);
    });
    this.node.addEventListener('change', () => {
      this.onChange();
    });
    this.setAttribute('multiple', 'true');
  }

  getValue(): string {
    return this.node.value;
  }
}
