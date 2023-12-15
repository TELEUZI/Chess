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
    this.appendChildren(this.options);
    this.node.addEventListener('change', this.handleEvent);
    this.setAttribute('multiple', 'true');
  }

  getValue(): string {
    return this.node.value;
  }

  public handleEvent = (): void => {
    this.onChange();
  };

  override destroy(): void {
    super.destroy();
    this.node.removeEventListener('change', this.handleEvent);
  }
}
