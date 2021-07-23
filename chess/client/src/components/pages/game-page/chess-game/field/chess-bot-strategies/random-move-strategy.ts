import FigureColor from '../../../../../../enums/figure-colors';
import { Strategy } from '../../../../../../interfaces/bot-strategy';
import MoveMessage, { FigureTurn } from '../../../../../../interfaces/move-message';
import getRandomIntegerInRange from '../../../../../../utils/random-generator';
import FieldState from '../../state/field-state';

export default class RandomMoveStrategy implements Strategy {
  avaliableMoves: FigureTurn[];

  public getBestMove(
    state: FieldState,
    color: FigureColor,
    avaliableMoves: FigureTurn[],
  ): MoveMessage {
    this.avaliableMoves = avaliableMoves;
    if (!avaliableMoves.length) return null;
    const randMove = avaliableMoves[getRandomIntegerInRange(avaliableMoves.length)];
    return { from: randMove.from, to: randMove.to[getRandomIntegerInRange(randMove.to.length)] };
  }
}
