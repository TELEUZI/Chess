import FigureType from '@client/app/enums/figure-type';
import FigureWeight from '@client/app/enums/figure-weight';
import FigureModel from './figure-model';

export default class Bishop extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.BISHOP);
    this.weight = FigureWeight.BISHOP;
  }
}
