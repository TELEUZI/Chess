import BaseComponent from '../base-component';
import SelectView from './select-view';

export default class SelectController<T = string> extends BaseComponent {
  private readonly select: SelectView;

  private readonly label: BaseComponent<'label'>;

  constructor(
    label: string,
    options: string[],
    private readonly onChange: () => void,
  ) {
    super({ className: 'select-controller' });
    this.label = new BaseComponent({ tag: 'label', className: 'label settings__label' });
    this.label.setContent(label);
    this.select = new SelectView(options, () => {
      this.onChange();
    });
    this.appendChildren([this.select, this.label]);
  }

  public getSelectValue(): T {
    return this.select.getValue() as T;
  }
}
