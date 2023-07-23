import type { Coordinate } from '@coordinate';
import FigureType from '@client/app/enums/figure-type';
import type FigureModel from '../../models/figures/figure-model';
import type FieldState from '../../state/field-state';
import store from '../../state/redux/store';
import BishopTurnManager from './move-managers/bishop-turn-manager';
import KingTurnManager from './move-managers/king-turn-manager';
import KnightTurnManager from './move-managers/knight-turn-manager';
import PawnTurnManager from './move-managers/pawn-turn-manager';
import QueenTurnManager from './move-managers/queen-turn-manager';
import RookTurnManager from './move-managers/rook-turn-manager';

export default class TurnManager {
  field: FieldState;

  pawnTurnManager: PawnTurnManager;

  knightTurnManager: KnightTurnManager;

  bishopTurnManager: BishopTurnManager;

  rookTurnManager: RookTurnManager;

  kingTurnManager: KingTurnManager;

  queenTurnManager: QueenTurnManager;

  constructor() {
    this.field = store.getState().field;
    this.pawnTurnManager = new PawnTurnManager();
    this.knightTurnManager = new KnightTurnManager();
    this.bishopTurnManager = new BishopTurnManager();
    this.rookTurnManager = new RookTurnManager();
    this.kingTurnManager = new KingTurnManager();
    this.queenTurnManager = new QueenTurnManager();
  }

  getMoves(
    state: FieldState,
    figure: FigureModel | null,
    fromX: number,
    fromY: number,
  ): Coordinate[] {
    if (!figure) return [];
    const res: Coordinate[] = [];
    if (figure.getType() === FigureType.PAWN) {
      return PawnTurnManager.getMoves(state, figure, fromX, fromY);
    }
    if (figure.getType() === FigureType.KNIGHT) {
      return KnightTurnManager.getMoves(state, figure, fromX, fromY);
    }
    if (figure.getType() === FigureType.BISHOP) {
      return this.bishopTurnManager.getMoves(state, figure, fromX, fromY);
    }
    if (figure.getType() === FigureType.KING) {
      return KingTurnManager.getMoves(state, figure, fromX, fromY);
    }
    if (figure.getType() === FigureType.ROOK) {
      return this.rookTurnManager.getMoves(state, figure, fromX, fromY);
    }
    if (figure.getType() === FigureType.QUEEN) {
      return this.queenTurnManager.getMoves(state, figure, fromX, fromY);
    }
    return res;
  }
}
