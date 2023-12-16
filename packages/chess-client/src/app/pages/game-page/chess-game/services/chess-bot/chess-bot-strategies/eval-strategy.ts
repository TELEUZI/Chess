import { BEST_VALUE_MOVE_FOR_BLACK } from '@client/app/config';
import type { BestMoveParams, Strategy } from '@client/app/interfaces/bot-strategy';
import type MoveMessage from '@client/app/interfaces/move-message';
import { getStateAfterMove } from '../../field-service/field-service';
import { evaluateBoard } from '../chess-bot';

function getBestMove({ state, availableMoves }: BestMoveParams): MoveMessage | null {
  let bestMove: MoveMessage | null = null;
  let bestValue = BEST_VALUE_MOVE_FOR_BLACK;
  availableMoves.forEach((newGameMove) => {
    newGameMove.to.forEach((moveTo) => {
      const newState = getStateAfterMove(
        state,
        newGameMove.from.x,
        newGameMove.from.y,
        moveTo.x,
        moveTo.y,
      );
      const boardValue = evaluateBoard(newState);
      if (boardValue >= bestValue) {
        bestValue = boardValue;
        bestMove = { from: newGameMove.from, to: moveTo };
      }
    });
  });
  return bestMove;
}

export default class EvaluationStrategy implements Strategy {
  public getBestMove = getBestMove;
}
