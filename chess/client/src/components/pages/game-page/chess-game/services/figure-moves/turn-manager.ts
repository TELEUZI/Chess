import FigureType from '../../../../../../enums/figure-type';
import Coordinate from '../../../../../../models/coordinate';
import FigureModel from '../../models/figures/figure-model';
import FieldState from '../../state/field-state';
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

  checkMove(state: FieldState, fromX: number, fromY: number, toX: number, toY: number): boolean {
    this.field = store.getState().field;
    const figure = this.field.getCellAt(fromX, fromY).getFigure();
    const allowed = this.getMoves(state, figure, fromX, fromY);
    return allowed.findIndex((coord) => coord.x === toX && coord.y === toY) !== -1;
  }

  isRightMove(posX: number, posY: number): boolean {
    return this.field.getCellAt(posX, posY) && !this.field.getCellAt(posX, posY).getFigure();
  }

  getMoves(state: FieldState, figure: FigureModel, fromX: number, fromY: number): Coordinate[] {
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
