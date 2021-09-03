import FigureColor from '../../../../../../enums/figure-colors';
import FigureType from '../../../../../../enums/figure-type';
import FigureWeight from '../../../../../../enums/figure-weight';

export interface FigureInfo {
  readonly type: FigureType;
  readonly color: FigureColor;
}
export default class FigureModel {
  protected type: FigureType;

  private color: FigureColor;

  protected weight = 0;

  constructor(color: FigureColor) {
    this.color = color;
  }

  getColor(): FigureColor {
    return this.color;
  }

  setColor(color: FigureColor): void {
    this.color = color;
  }

  getType(): FigureType {
    return this.type;
  }

  getWeight(): FigureWeight {
    return this.weight;
  }
}
