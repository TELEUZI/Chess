import { FigureType } from '@chess/game-common';
import { FigureWeight } from '@chess/game-engine';
import { FigureModel } from './figure-model';

export class Bishop extends FigureModel {
  constructor(color: number) {
    super(color, FigureType.BISHOP);
    this.weight = FigureWeight.BISHOP;
  }
}
