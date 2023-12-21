import { FigureColor } from '@chess/game-common';

import {
  RandomMoveStrategy,
  type FieldModel,
  type FieldState,
  type Strategy,
} from '@chess/game-engine';
import { forEachPlayerFigure } from '../field-service/field-service';

export function evaluateBoard(chess: FieldState): number {
  let whiteScore = 0;
  let blackScore = 0;

  forEachPlayerFigure(chess, FigureColor.WHITE, (cell) => {
    whiteScore += cell.getFigureWeight() ?? 0;
  });
  forEachPlayerFigure(chess, FigureColor.BLACK, (cell) => {
    blackScore -= cell.getFigureWeight() ?? 0;
  });
  return whiteScore + blackScore;
}

export class ChessBot {
  private readonly model: FieldModel;

  private readonly strategy: Strategy;

  constructor(model: FieldModel, strategy: Strategy | null = null) {
    this.model = model;
    forEachPlayerFigure.bind(this);
    this.strategy = strategy ?? new RandomMoveStrategy();
  }

  public makeBotMove(state: FieldState, color: FigureColor): void {
    const bestMove = this.strategy.getBestMove({
      state,
      color,
      availableMoves: this.model.getAllValidMoves(state, color),
    });
    if (!bestMove) {
      return;
    }
    void this.model
      .makeMove(bestMove.from.x, bestMove.from.y, bestMove.to.x, bestMove.to.y)
      .then(() => {
        this.model.checkGameSituation();
      });
  }
}
