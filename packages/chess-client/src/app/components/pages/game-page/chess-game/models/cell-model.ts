import type FigureColor from '../../../../../enums/figure-colors';
import type FigureType from '../../../../../enums/figure-type';
import type { FigureInfo } from './figures/figure-model';
import type FigureModel from './figures/figure-model';

export default class CellModel {
  private figure: FigureModel;

  constructor(figure: FigureModel) {
    this.figure = figure;
  }

  public setFigure(figure: FigureModel): void {
    this.figure = figure;
  }

  public getFigure(): FigureModel | null {
    return this.figure;
  }

  public getFigureColor(): FigureColor {
    return this.figure.getColor();
  }

  public getFigureType(): FigureType {
    return this.figure.getType();
  }

  public setFigureColor(color: FigureColor): void {
    this.figure.setColor(color);
  }

  public getFigureWeight(): number {
    return this.figure.getWeight();
  }

  public getFigureExternalInfo(): FigureInfo {
    return { type: this.getFigureType(), color: this.getFigureColor() };
  }
}
