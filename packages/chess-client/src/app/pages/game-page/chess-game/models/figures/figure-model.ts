import type { FigureWeightValues } from '@client/app/enums/figure-weight';
import type FigureColor from '@client/app/enums/figure-colors';
import type FigureType from '@client/app/enums/figure-type';
import FigureWeight from '@client/app/enums/figure-weight';

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

  getColor(): FigureColor {
    return this.color;
  }

  setColor(color: FigureColor): void {
    this.color = color;
  }

  getType(): FigureType {
    return this.type;
  }

  getWeight(): FigureWeightValues {
    return this.weight;
  }
}
