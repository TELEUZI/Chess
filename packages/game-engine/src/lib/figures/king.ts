import { FigureType } from '@chess/game-common';
import { FigureWeight } from '@chess/game-engine';
import { FigureModel } from './figure-model';

export class King extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.KING);
    this.weight = FigureWeight.KING;
  }
}
