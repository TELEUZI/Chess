import BaseComponent from '../base-component';
import SelectView from './select-view';

export default class SelectController extends BaseComponent {
  private select: SelectView;

  private label: BaseComponent;

  onChange: () => void = () => {};

  constructor(label: string, options: string[]) {
    super('div', ['select-controller'], '');
    this.label = new BaseComponent('label');
    this.label.setContent(label);
    this.select = new SelectView(options);
    this.insertChilds([this.select, this.label]);
    this.select.onChange = () => this.onChange();
  }

  getSelectValue(): string {
    return this.select.getValue();
  }
}
