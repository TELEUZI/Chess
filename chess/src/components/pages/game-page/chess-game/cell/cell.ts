import FigureModel from '../figures/figure-model';

export default class CellModel {
  private figure: FigureModel;

  constructor(figure: FigureModel) {
    this.figure = figure;
  }

  setFigure(figure: FigureModel): void {
    this.figure = figure;
  }

  getFigure(): FigureModel {
    return this.figure;
  }

  getFigureColor(): number {
    return this.figure?.getColor();
  }

  getFigureType(): string {
    return this.figure?.getType();
  }

  setFigureColor(color: number): void {
    this.figure.setColor(color);
  }
}
