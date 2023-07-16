import type FigureColor from '../../../../../../enums/figure-colors';
import type { Strategy } from '../../../../../../interfaces/bot-strategy';
import type { FigureTurn } from '../../../../../../interfaces/move-message';
import type MoveMessage from '../../../../../../interfaces/move-message';
import getRandomIntegerInRange from '../../../../../../utils/random-generator';
import type FieldState from '../../state/field-state';

export default class RandomMoveStrategy implements Strategy {
  avaliableMoves: FigureTurn[] = [];

  public getBestMove(
    state: FieldState,
    color: FigureColor,
    avaliableMoves: FigureTurn[],
  ): MoveMessage | null {
    this.avaliableMoves = avaliableMoves;
    if (!avaliableMoves.length) return null;
    const randMove = avaliableMoves[getRandomIntegerInRange(avaliableMoves.length)];
    return { from: randMove.from, to: randMove.to[getRandomIntegerInRange(randMove.to.length)] };
  }
}
