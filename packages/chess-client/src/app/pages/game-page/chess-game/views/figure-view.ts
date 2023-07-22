import BaseComponent from '@client/app/components/base-component';

class FigureView extends BaseComponent {
  constructor(parentNode: HTMLElement, style: string[]) {
    super('div', [...style], '', parentNode);
  }
}

export default FigureView;
