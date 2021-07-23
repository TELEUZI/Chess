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
    let bestValue = -9999;
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
        console.log(boardValue, bestValue);
        if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = { from: newGameMove.from, to: moveTo };
        }
      });
    });
    console.log(bestMove, bestValue);
    return bestMove;
  }
}
