import FigureColor from '../../../../../enums/figure-colors';
import FieldState from '../state/field-state';
import FieldModel from './field-model';
import { forEachPlayerFigure } from '../services/field-service/field-service';
import { Strategy } from '../../../../../interfaces/bot-strategy';

export function evaluateBoard(chess: FieldState): number {
  let whiteScore = 0;
  let blackScore = 0;

  forEachPlayerFigure(chess, FigureColor.WHITE, (cell) => {
    whiteScore += cell.getFigureWeight();
  });
  forEachPlayerFigure(chess, FigureColor.BLACK, (cell) => {
    blackScore -= cell.getFigureWeight();
  });
  return whiteScore + blackScore;
}

export default class ChessBot {
  private model: FieldModel;

  private currentColor: FigureColor = FigureColor.BLACK;

  private strategy: Strategy;

  constructor(model: FieldModel, strategy: Strategy) {
    this.model = model;
    forEachPlayerFigure.bind(this);
    this.strategy = strategy;
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
    this.model.makeMove(bestMove.from.x, bestMove.from.y, bestMove.to.x, bestMove.to.y);
    this.model.checkGameSituation();
  }
}
