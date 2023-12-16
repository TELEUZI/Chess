import FigureType from '@client/app/enums/figure-type';
import FigureWeight from '@client/app/enums/figure-weight';
import FigureModel from './figure-model';

export default class King extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.KING);
    this.weight = FigureWeight.KING;
  }
}
