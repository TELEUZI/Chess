import { BEST_VALUE_MOVE_FOR_BLACK } from '../../../../../../config';
import FigureColor from '../../../../../../enums/figure-colors';
import { Strategy } from '../../../../../../interfaces/bot-strategy';
import MoveMessage, { FigureTurn } from '../../../../../../interfaces/move-message';
import { getStateAfterMove } from '../../services/field-service/field-service';
import FieldState from '../../state/field-state';
import { evaluateBoard } from '../chess-bot';

export default class EvaluationStrategy implements Strategy {
  avaliableMoves: FigureTurn[];

  public getBestMove(
    state: FieldState,
    color: FigureColor,
    avaliableMoves: FigureTurn[],
  ): MoveMessage {
    this.avaliableMoves = avaliableMoves;
    let bestMove: MoveMessage = null;
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
