import type { FigureWeightValues } from '@client/app/enums/figure-weight';
import type FigureType from '@client/app/enums/figure-type';
import FigureWeight from '@client/app/enums/figure-weight';
import type { FigureColor } from '@chess/game-common';

export interface FigureInfo {
  readonly type: FigureType | null;
  readonly color: FigureColor | null;
}

export default class FigureModel {
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
