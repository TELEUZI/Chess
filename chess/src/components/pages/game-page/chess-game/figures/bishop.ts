import FigureModel from './figure-model';

export default class Bishop extends FigureModel {
  constructor(color: number) {
    super(color);
    this.type = 'e';
  }
}
