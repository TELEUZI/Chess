import type { BestMoveParams, Strategy } from '../../../../../../interfaces/bot-strategy';
import type MoveMessage from '../../../../../../interfaces/move-message';
import getRandomIntegerInRange from '../../../../../../utils/random-generator';

export default class RandomMoveStrategy implements Strategy {
  public getBestMove({ avaliableMoves }: BestMoveParams): MoveMessage | null {
    if (!avaliableMoves.length) return null;
    const randMove = avaliableMoves[getRandomIntegerInRange(avaliableMoves.length)];
    return { from: randMove.from, to: randMove.to[getRandomIntegerInRange(randMove.to.length)] };
  }
}
