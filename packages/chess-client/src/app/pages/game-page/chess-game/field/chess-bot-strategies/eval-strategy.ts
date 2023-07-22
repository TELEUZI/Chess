import { BEST_VALUE_MOVE_FOR_BLACK } from '../../../../../config';
import type { BestMoveParams, Strategy } from '../../../../../interfaces/bot-strategy';
import type MoveMessage from '../../../../../interfaces/move-message';
import { getStateAfterMove } from '../../services/field-service/field-service';
import { evaluateBoard } from '../chess-bot';

export default class EvaluationStrategy implements Strategy {
  public getBestMove({ state, avaliableMoves }: BestMoveParams): MoveMessage | null {
    let bestMove: MoveMessage | null = null;
    let bestValue = BEST_VALUE_MOVE_FOR_BLACK;
    avaliableMoves.forEach((newGameMove) => {
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
}
