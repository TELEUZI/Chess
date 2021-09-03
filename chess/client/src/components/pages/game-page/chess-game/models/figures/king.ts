import FigureType from '../../../../../../enums/figure-type';
import FigureModel from './figure-model';
import FigureWeight from '../../../../../../enums/figure-weight';

export default class King extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = FigureType.KING;
    this.weight = FigureWeight.KING;
  }
}
