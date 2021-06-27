import FigureModel from './figure-model';

export default class King extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = 'k';
    this.weight = 900;
  }
}
