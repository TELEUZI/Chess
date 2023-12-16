import './icon.scss';
import BaseComponent from '../../base-component';

export default class Icon extends BaseComponent {
  constructor(iconClass: string[] = []) {
    super({ tag: 'div', className: `icon ${iconClass.join(' ')}` });
  }
}
