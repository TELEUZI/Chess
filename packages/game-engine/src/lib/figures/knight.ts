import { FigureType } from '@chess/game-common';
import { FigureWeight } from '@chess/game-engine';
import { FigureModel } from './figure-model';

export class Knight extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.KNIGHT);
    this.weight = FigureWeight.KNIGHT;
  }
}
