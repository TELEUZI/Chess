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
        const boardValue = this.minimax(2, newState, color, avaliableMoves, !!color);
        if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = { from: newGameMove.from, to: moveTo };
        }
      });
    });
    console.log(bestMove, bestValue);
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
      return this.findMinMax(
        depth,
        state,
        color,
        avaliableMoves,
        isMaximizingPlayer,
        Math.max,
        -9999,
      );
    }
    return this.findMinMax(depth, state, color, avaliableMoves, isMaximizingPlayer, Math.min, 9999);
  }

  findMinMax(
    depth: number,
    state: FieldState,
    color: FigureColor,
    avaliableMoves: FigureTurn[],
    isMaximizingPlayer: boolean,
    extremumFunc: (...values: number[]) => number,
    bestValue: number,
  ): number {
    let bestMove = bestValue;
    avaliableMoves.forEach((newGameMove) => {
      newGameMove.to.forEach((move) => {
        const newState = getStateAfterMove(
          state,
          newGameMove.from.x,
          newGameMove.from.y,
          move.x,
          move.y,
        );
        bestMove = extremumFunc(
          bestMove,
          this.minimax(depth - 1, newState, color, avaliableMoves, !isMaximizingPlayer),
        );
      });
    });
    return bestMove;
  }
}
