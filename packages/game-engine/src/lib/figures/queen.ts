import { FigureType } from '@chess/game-common';
import { FigureWeight } from '@chess/game-engine';
import { FigureModel } from './figure-model';

export class Queen extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.QUEEN);
    this.weight = FigureWeight.QUEEN;
  }
}
