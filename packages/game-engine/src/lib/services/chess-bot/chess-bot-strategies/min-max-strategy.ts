import { BEST_VALUE_MOVE_FOR_BLACK } from '@chess/config';

import type { FigureColor, FigureTurn, MoveMessage } from '@chess/game-common';
import type { BestMoveParams, FieldState, Strategy } from '@chess/game-engine';
import { getStateAfterMove } from '../../field-service/field-service';
import { evaluateBoard } from '../chess-bot';

const SEARCH_DEPTH = 2;
export class MinMaxBotStrategy implements Strategy {
  public getBestMove({ state, color, availableMoves }: BestMoveParams): MoveMessage | null {
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
        const boardValue = this.minimax(
          SEARCH_DEPTH,
          newState,
          color,
          availableMoves,
          Boolean(color),
        );
        if (boardValue >= bestValue) {
          bestValue = boardValue;
          bestMove = { from: newGameMove.from, to: moveTo };
        }
      });
    });
    return bestMove;
  }

  private minimax(
    depth: number,
    state: FieldState,
    color: FigureColor,
    availableMoves: FigureTurn[],
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
        availableMoves,
        isMaximizingPlayer,
        Math.max,
        -9999,
      );
    }
    return this.findMinMax(depth, state, color, availableMoves, isMaximizingPlayer, Math.min, 9999);
  }

  private findMinMax(
    depth: number,
    state: FieldState,
    color: FigureColor,
    availableMoves: FigureTurn[],
    isMaximizingPlayer: boolean,
    extremumFunc: (...values: number[]) => number,
    bestValue: number,
  ): number {
    let bestMove = bestValue;
    availableMoves.forEach((newGameMove) => {
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
          this.minimax(depth - 1, newState, color, availableMoves, !isMaximizingPlayer),
        );
      });
    });
    return bestMove;
  }
}