import FigureType from '../../../../../../enums/figure-type';
import FigureModel from './figure-model';
import FigureWeight from '../../../../../../enums/figure-weight';

export default class Pawn extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = FigureType.PAWN;
    this.weight = FigureWeight.PAWN;
  }
}
