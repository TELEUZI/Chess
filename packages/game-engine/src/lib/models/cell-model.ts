import type { FigureColor, FigureType, FigureInfo } from '@chess/game-common';
import type { FigureModel } from '@chess/game-engine';

export class CellModel {
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
