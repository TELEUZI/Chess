import BaseComponent from '../../../../base-component';

class Figure extends BaseComponent {
  constructor(parentNode: HTMLElement, style: string[]) {
    super('div', [...style], '', parentNode);
  }
}

export default Figure;
