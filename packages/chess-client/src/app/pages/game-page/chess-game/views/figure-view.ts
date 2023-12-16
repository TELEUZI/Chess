import BaseComponent from '@client/app/components/base-component';

class FigureView extends BaseComponent {
  constructor(parent: HTMLElement, style: string[]) {
    super({ tag: 'div', className: ['figure', ...style].join(' '), content: '', parent });
  }
}

export default FigureView;
