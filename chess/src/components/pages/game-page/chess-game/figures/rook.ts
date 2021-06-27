import FigureModel from './figure-model';

export default class Rook extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = 'r';
    this.weight = 50;
  }
}
