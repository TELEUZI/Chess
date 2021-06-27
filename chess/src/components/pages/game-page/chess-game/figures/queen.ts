import FigureModel from './figure-model';

export default class Queen extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = 'q';
    this.weight = 90;
  }
}
