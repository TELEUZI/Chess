import { FigureType } from '@chess/game-common';
import { FigureWeight } from '@chess/game-engine';
import { FigureModel } from './figure-model';

export class Pawn extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.PAWN);
    this.weight = FigureWeight.PAWN;
  }
}
