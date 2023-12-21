import type { FigureColor, FigureType } from '@chess/game-common';
import type { FigureWeightValues } from '@chess/game-engine';
import { FigureWeight } from '@chess/game-engine';

export class FigureModel {
  protected weight: FigureWeightValues = FigureWeight.PAWN;

  constructor(
    private color: FigureColor,
    protected type: FigureType,
  ) {}

  public getColor(): FigureColor {
    return this.color;
  }

  public setColor(color: FigureColor): void {
    this.color = color;
  }

  public getType(): FigureType {
    return this.type;
  }

  public getWeight(): FigureWeightValues {
    return this.weight;
  }
}
