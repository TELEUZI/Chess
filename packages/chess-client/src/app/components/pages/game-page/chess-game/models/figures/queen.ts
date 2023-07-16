import FigureType from '../../../../../../enums/figure-type';
import FigureModel from './figure-model';
import FigureWeight from '../../../../../../enums/figure-weight';

export default class Queen extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.QUEEN);
    this.weight = FigureWeight.QUEEN;
  }
}
