import FigureType from '../../../../../../enums/figure-type';
import FigureModel from './figure-model';
import FigureWeight from '../../../../../../enums/figure-weight';

export default class Knight extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.KNIGHT);
    this.weight = FigureWeight.KNIGHT;
  }
}
