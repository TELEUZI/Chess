import FigureColor from '../../../../../enums/figure-colors';
import FieldState from '../state/field-state';
import FieldModel from './field-model';
import TurnManager from '../services/figure-moves/turn-manager';
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
  model: FieldModel;

  turnManager: TurnManager;

  currentColor: FigureColor = FigureColor.BLACK;

  private strategy: Strategy;

  constructor(model: FieldModel, strategy: Strategy) {
    this.model = model;
    this.turnManager = new TurnManager();
    forEachPlayerFigure.bind(this);
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy): void {
    this.strategy = strategy;
  }

  getLogicMove(state: FieldState, color: FigureColor): void {
    const bestMove = this.strategy.getBestMove(
      state,
      color,
      this.model.getAllValidMoves(state, color),
    );
    const froms: Array<{ x: number; y: number }> = this.model.getEnemyFigures(
      this.model.state,
      this.currentColor,
    );
    if (!froms.length) {
      return;
    }
    this.model.makeMove(bestMove.from.x, bestMove.from.y, bestMove.to.x, bestMove.to.y);
    this.model.checkGameSituation();
  }
}
