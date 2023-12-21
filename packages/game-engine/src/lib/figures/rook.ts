import { FigureType } from '@chess/game-common';
import { FigureWeight } from '@chess/game-engine';
import { FigureModel } from './figure-model';

export class Rook extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.ROOK);
    this.weight = FigureWeight.ROOK;
  }
}
