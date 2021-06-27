import FigureModel from './figure-model';

export default class Knight extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = 'n';
    this.weight = 30;
  }
}
