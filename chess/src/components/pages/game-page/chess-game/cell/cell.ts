import BaseComponent from '../../../../base-component';
import FigureModel from '../figures/figure-model';
import CellView from './cell-view';

export default class Cell extends BaseComponent {
  private view: CellView;

  private figure: FigureModel;

  constructor() {
    super('div', ['cell-wrapper']);
    this.view = new CellView(this.getNode());
  }

  setFigure(figure: FigureModel): void {
    this.figure = figure;
  }

  getFigure(): FigureModel {
    return this.figure;
  }

  getFigureColor(): number {
    return this.figure.getColor();
  }

  setViewClass(viewClasses: string): void {
    const classes = viewClasses.split(' ');
    classes.forEach((viewClass: string) => {
      this.view.addClass(viewClass);
    });
  }
}
