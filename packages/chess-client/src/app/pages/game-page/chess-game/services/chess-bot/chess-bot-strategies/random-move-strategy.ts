import type {
  BestMoveParams,
  Strategy,
} from '@client/app/pages/game-page/chess-game/services/chess-bot/bot-strategy';
import type MoveMessage from '@client/app/interfaces/move-message';
import getRandomIntegerInRange from '@client/app/utils/random-generator';

function getBestMove({ availableMoves }: BestMoveParams): MoveMessage | null {
  if (!availableMoves.length) return null;
  const randMove = availableMoves[getRandomIntegerInRange(availableMoves.length)];
  return { from: randMove.from, to: randMove.to[getRandomIntegerInRange(randMove.to.length)] };
}

export default class RandomMoveStrategy implements Strategy {
  public getBestMove = getBestMove;
}
