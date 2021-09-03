import './icon.scss';
import BaseComponent from '../../base-component';

export default class Icon extends BaseComponent {
  constructor(iconClass?: string[]) {
    super('div', ['icon', ...iconClass], '');
  }
}
