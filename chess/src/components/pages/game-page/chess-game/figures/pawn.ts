import FigureModel from './figure-model';

export default class Pawn extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = 'p';
  }
}
