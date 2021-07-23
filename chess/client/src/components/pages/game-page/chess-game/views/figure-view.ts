import BaseComponent from '../../../../base-component';

class FigureView extends BaseComponent {
  constructor(parentNode: HTMLElement, style: string[]) {
    super('div', [...style], '', parentNode);
  }
}

export default FigureView;
