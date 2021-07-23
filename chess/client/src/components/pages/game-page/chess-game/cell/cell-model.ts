import FigureColor from '../../../../../enums/figure-colors';
import FigureType from '../../../../../enums/figure-type';
import FigureModel, { FigureInfo } from '../models/figures/figure-model';

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

  getFigureColor(): FigureColor {
    return this.figure?.getColor();
  }

  getFigureType(): FigureType {
    return this.figure?.getType();
  }

  setFigureColor(color: FigureColor): void {
    this.figure.setColor(color);
  }

  getFigureWeight(): number {
    return this.figure.getWeight();
  }

  getFigureExternalInfo(): FigureInfo {
    return { type: this.getFigureType(), color: this.getFigureColor() };
  }
}
