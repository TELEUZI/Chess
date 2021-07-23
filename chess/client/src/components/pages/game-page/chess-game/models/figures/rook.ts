import FigureType from '../../../../../../enums/figure-type';
import FigureWeight from '../../../../../../enums/figure-weight';
import FigureModel from './figure-model';

export default class Rook extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = FigureType.ROOK;
    this.weight = FigureWeight.ROOK;
  }
}
