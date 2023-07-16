import FigureColor from '../../../../../enums/figure-colors';
import type FieldState from '../state/field-state';
import type FieldModel from './field-model';
import { forEachPlayerFigure } from '../services/field-service/field-service';
import type { Strategy } from '../../../../../interfaces/bot-strategy';
import RandomMoveStrategy from './chess-bot-strategies/random-move-strategy';

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

export default class ChessBot {
  private readonly model: FieldModel;

  // private readonly currentColor: FigureColor = FigureColor.BLACK;

  private strategy: Strategy;

  constructor(model: FieldModel, strategy: Strategy | null = null) {
    this.model = model;
    forEachPlayerFigure.bind(this);
    this.strategy = strategy ?? new RandomMoveStrategy();
  }

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  makeBotMove(state: FieldState, color: FigureColor): void {
    const bestMove = this.strategy.getBestMove(
      state,
      color,
      this.model.getAllValidMoves(state, color),
    );
    if (!bestMove) {
      return;
    }
    this.model.makeMove(bestMove.from.x, bestMove.from.y, bestMove.to.x, bestMove.to.y);
    this.model.checkGameSituation();
  }
}
