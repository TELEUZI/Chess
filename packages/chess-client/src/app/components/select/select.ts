import BaseComponent from '../base-component';
import SelectView from './select-view';

export default class SelectController extends BaseComponent {
  private readonly select: SelectView;

  private readonly label: BaseComponent;

  constructor(label: string, options: string[], private readonly onChange: () => void) {
    super('div', ['select-controller'], '');
    this.label = new BaseComponent('label', ['label', 'settings__label']);
    this.label.setContent(label);
    this.select = new SelectView(options, () => {
      this.onChange();
    });
    this.insertChilds([this.select, this.label]);
  }

  getSelectValue(): string {
    return this.select.getValue();
  }
}
