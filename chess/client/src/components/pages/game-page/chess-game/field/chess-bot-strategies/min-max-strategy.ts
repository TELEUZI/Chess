import FigureColor from '../../../../../../enums/figure-colors';
import { Strategy } from '../../../../../../interfaces/bot-strategy';
import MoveMessage, { FigureTurn } from '../../../../../../interfaces/move-message';
import { getStateAfterMove } from '../../services/field-service/field-service';
import FieldState from '../../state/field-state';
import { evaluateBoard } from '../chess-bot';

export default class MinMaxBotStrategy implements Strategy {
  public getBestMove(
    state: FieldState,
    color: FigureColor,
    avaliableMoves: FigureTurn[],
  ): MoveMessage {
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
        const boardValue = this.minimax(2, newState, color, avaliableMoves, false);
        if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = { from: newGameMove.from, to: moveTo };
        }
      });
    });
    return bestMove;
  }

  minimax(
    depth: number,
    state: FieldState,
    color: FigureColor,
    avaliableMoves: FigureTurn[],
    isMaximizingPlayer: boolean,
  ): number {
    if (depth === 0) {
      return evaluateBoard(state);
    }
    if (isMaximizingPlayer) {
      let bestMove = -9999;
      avaliableMoves.forEach((newGameMove) => {
        newGameMove.to.forEach((move) => {
          const newState = getStateAfterMove(
            state,
            newGameMove.from.x,
            newGameMove.from.y,
            move.x,
            move.y,
          );
          bestMove = Math.max(
            bestMove,
            this.minimax(depth - 1, newState, color, avaliableMoves, !isMaximizingPlayer),
          );
        });
      });
    } else {
      let bestMove = 9999;
      avaliableMoves.forEach((newGameMove) => {
        newGameMove.to.forEach((move) => {
          const newState = getStateAfterMove(
            state,
            newGameMove.from.x,
            newGameMove.from.y,
            move.x,
            move.y,
          );
          bestMove = Math.min(
            bestMove,
            this.minimax(depth - 1, newState, color, avaliableMoves, !isMaximizingPlayer),
          );
        });
      });
    }
    return null;
  }
}
