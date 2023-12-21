import type { MoveMessage } from '@chess/game-common';
import type { BestMoveParams, Strategy } from '@chess/game-engine';
import { getRandomIntegerInRange } from '@chess/utils';

function getBestMove({ availableMoves }: BestMoveParams): MoveMessage | null {
  if (!availableMoves.length) return null;
  const randMove = availableMoves[getRandomIntegerInRange(availableMoves.length)];
  return { from: randMove.from, to: randMove.to[getRandomIntegerInRange(randMove.to.length)] };
}

export class RandomMoveStrategy implements Strategy {
  public getBestMove = getBestMove;
}
