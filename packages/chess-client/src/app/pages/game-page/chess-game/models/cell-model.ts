import type FigureColor from '@client/app/enums/figure-colors';
import type FigureType from '@client/app/enums/figure-type';
import type { FigureInfo } from './figures/figure-model';
import type FigureModel from './figures/figure-model';

export default class CellModel {
  private figure: FigureModel | null = null;

  constructor(figure: FigureModel | null) {
    this.figure = figure;
  }

  public setFigure(figure: FigureModel | null): void {
    this.figure = figure;
  }

  public getFigure(): FigureModel | null {
    return this.figure ?? null;
  }

  public getFigureColor(): FigureColor | null {
    return this.figure?.getColor() ?? null;
  }

  public getFigureType(): FigureType | null {
    return this.figure?.getType() ?? null;
  }

  public setFigureColor(color: FigureColor): void {
    this.figure?.setColor(color);
  }

  public getFigureWeight(): number | null {
    return this.figure?.getWeight() ?? null;
  }

  public getFigureExternalInfo(): FigureInfo {
    return { type: this.getFigureType(), color: this.getFigureColor() };
  }
}
