import { Coordinate } from '@coordinate';
import FigureColor from '../../../../../enums/figure-colors';
import GameMode from '../../../../../enums/game-mode';
import { socketService } from '../../../../../services/websocket-service';
import getNextFigureColor from '../../../../../utils/get-next-figure-color';
import type CellModel from '../models/cell-model';

import type FieldState from '../state/field-state';
import store from '../state/redux/store';
import createFieldFromStrings from '../fabrics/field-fabric';
import TurnManager from '../services/figure-moves/turn-manager';
import { createFigurefromString } from '../fabrics/figure-fabric';
import type { FigureTurn } from '../../../../../interfaces/move-message';
import type MoveMessage from '../../../../../interfaces/move-message';
import {
  getKingPosition,
  forEachPlayerFigure,
  getStateAfterMove,
  getFigureFromState,
} from '../services/field-service/field-service';
import Observable from '../../../../../services/observable';
import type { GameResult } from '../../../../../interfaces/replay';
import { setCurrentUserColor, makeMove } from '../state/redux/action-creators';
import { getBoardFromFen, getFenFromStringBoard } from '../utils/fen-processor';
import getOpeningName from '../../../../../services/chess-openings-service';
import type TurnInfo from '../../../../../interfaces/turn-info';
import FigureType from '../../../../../enums/figure-type';
import { INIT_FIELD_STATE } from '../../../../../config';

export default class FieldModel {
  public state: FieldState;

  private currentColor = FigureColor.WHITE;

  private readonly turnManager: TurnManager;

  private readonly gameMode: GameMode = GameMode.SINGLE;

  private gameResult: GameResult;

  onChange = new Observable<FieldState>();

  onCheck = new Observable<Coordinate>();

  onMate = new Observable<Coordinate>();

  onMove = new Observable<TurnInfo>();

  onNextTurn = new Observable<void>();

  onStalemate: () => void;

  onBotMove: () => void;

  onSinglePlayerMove: () => void;

  onReset: () => void;

  onCheckPromotion: (cell: CellModel) => void;

  constructor() {
    this.turnManager = new TurnManager();
    const initState = createFieldFromStrings(INIT_FIELD_STATE);
    this.state = store.getState().field;
    this.setState(initState);
    this.gameMode = store.getState().gameMode.currentGameMode;
    socketService.onMove = (state: string, currentColor: FigureColor, lastMove: MoveMessage) => {
      this.onMove.notify({
        figure: {
          type: this.getCellAt(lastMove.to)?.getFigureType() ?? null,
          color: this.getCellAt(lastMove.to)?.getFigureColor() ?? null,
        },
        move: lastMove,
      });
      const newState = getBoardFromFen(state);
      const st = createFieldFromStrings(newState);
      this.setState(st);
      this.currentColor = currentColor;
    };
  }

  setNextPlayerColor(): void {
    if (this.gameMode === GameMode.SINGLE) {
      store.dispatch(
        setCurrentUserColor(getNextFigureColor(store.getState().currentPlayer.currentUserColor)),
      );
    }
    this.currentColor = store.getState().currentPlayer.currentUserColor;
  }

  promote(i: number, j: number): void {
    this.state.setFigureAtCell(
      createFigurefromString(
        this.getCellAt(new Coordinate(i, j))?.getFigureColor() === FigureColor.WHITE
          ? FigureType.QUEEN.toUpperCase()
          : FigureType.QUEEN,
      ),
      i,
      j,
    );
    store.dispatch(makeMove(this.state));
  }

  checkGameSituation(): void {
    const isMoves = this.getAllValidMoves(this.state, this.currentColor).length !== 0;
    if (!isMoves && this.getCheckedKing(this.state)) {
      this.onMate.notify(getKingPosition(this.state, this.currentColor));
      this.gameResult = this.currentColor;
      this.onReset();
    } else if (!isMoves && !this.getCheckedKing(this.state)) {
      this.onStalemate();
      this.gameResult = 'draw';
      this.onReset();
    } else if (this.getCheckedKing(this.state)) {
      this.onCheck.notify(getKingPosition(this.state, this.currentColor));
    }
  }

  moveFigure(fromX: number, fromY: number, toX: number, toY: number): void {
    const allowed = this.getAllowedMovesFromPoint(fromX, fromY);
    const isAllowed = allowed.findIndex((it) => {
      return it.x === toX && it.y === toY;
    });
    if (isAllowed === -1 || (fromX === toX && fromY === toY)) {
      this.checkGameSituation();
      return;
    }
    this.makeMove(fromX, fromY, toX, toY);
    if (this.gameMode === GameMode.SINGLE) {
      this.onSinglePlayerMove();
    } else if (this.gameMode === GameMode.BOT) {
      this.onBotMove();
    } else if (this.gameMode === GameMode.MULTIPLAYER) {
      socketService.move(getFenFromStringBoard(this.state.getPlainState()), {
        from: new Coordinate(fromX, fromY),
        to: new Coordinate(toX, toY),
      });
    }
    this.onCheckPromotion(this.getCellAt(new Coordinate(toX, toY)));
    this.setNextPlayerColor();
    this.checkGameSituation();
  }

  async makeMove(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    const fromCell = this.state.getCellAt(fromX, fromY);
    const toCell = this.state.getCellAt(toX, toY);
    if (fromCell === null || toCell === null) {
      return;
    }
    toCell.setFigure(fromCell.getFigure());
    fromCell.setFigure(null);
    this.setState(this.state);
    this.onNextTurn.notify();
    const fenState = getFenFromStringBoard(this.state.getPlainState());
    const isOpening = await getOpeningName(fenState);
    const move: TurnInfo = {
      figure: this.state.getCellAt(toX, toY)?.getFigureExternalInfo(),
      move: { from: new Coordinate(fromX, fromY), to: new Coordinate(toX, toY) },
      ...(isOpening && { comment: isOpening }),
    };
    this.checkGameSituation();
    this.onMove.notify(move);
  }

  getEnemyFigures(state: FieldState, color: number): { x: number; y: number }[] {
    const res: { x: number; y: number }[] = [];
    forEachPlayerFigure(state, color, (cell, pos) => {
      if (this.getMovesAtPoint(pos.x, pos.y, state).length) {
        res.push(pos);
      }
    });
    return res;
  }

  getCellAt(to: Coordinate): CellModel | null {
    return this.state.getCellAt(to.x, to.y);
  }

  getCheckedKing(state: FieldState): boolean {
    const kingPos = getKingPosition(state, this.currentColor);
    if (!kingPos) {
      return false;
    }
    return this.getCheckedStatus(state, kingPos.x, kingPos.y).isChecked;
  }

  getAllValidMoves(state: FieldState, color: FigureColor): FigureTurn[] {
    const moves: FigureTurn[] = [];
    const kingPos = getKingPosition(state, color);
    forEachPlayerFigure(state, color, (_, pos) => {
      if (this.getMovesAtPoint(pos.x, pos.y, state).length) {
        moves.push({ from: pos, to: this.getMovesAtPoint(pos.x, pos.y, state) });
      }
    });
    return moves.filter((move) => {
      const to: Coordinate[] = move.to.filter((moveTo) => {
        const nextState = getStateAfterMove(state, move.from.x, move.from.y, moveTo.x, moveTo.y);
        return !this.getCheckedKing(nextState) && !moveTo.equals(kingPos);
      });
      return to.length !== 0;
    });
  }

  private getCheckedStatus(state: FieldState, posX: number, posY: number) {
    let res = false;
    let enemyCell: Coordinate | null = null;
    const enemies = this.getEnemyFigures(state, getNextFigureColor(this.currentColor));
    enemies.forEach((enemy) => {
      const allowed = this.getMovesAtPoint(enemy.x, enemy.y, state);
      allowed.forEach((al) => {
        if (al.x === posX && al.y === posY) {
          res = true;
          enemyCell = new Coordinate(enemy.x, enemy.y);
        }
      });
    });
    return { isChecked: res, attackingFigure: enemyCell };
  }

  getAllowedMovesFromPoint = (fromX: number, fromY: number): Coordinate[] => {
    if (
      this.state.getFigure(fromX, fromY) &&
      this.state.getFigureColor(fromX, fromY) === store.getState().currentPlayer.currentUserColor &&
      (this.gameMode === GameMode.SINGLE ||
        store.getState().currentPlayer.currentUserColor === store.getState().color.color)
    ) {
      let moves: Coordinate[] = this.getMovesAtPoint(fromX, fromY);
      moves = moves.filter((move) => {
        const nextState = getStateAfterMove(this.state, fromX, fromY, move.x, move.y);
        return (
          !this.getCheckedKing(nextState) &&
          !move.equals(getKingPosition(this.state, this.currentColor))
        );
      });
      return moves;
    }
    return [];
  };

  setEndGame(): void {
    this.setState(createFieldFromStrings(INIT_FIELD_STATE));
    store.dispatch(setCurrentUserColor(FigureColor.WHITE));
  }

  getMovesAtPoint(fromX: number, fromY: number, state?: FieldState): Coordinate[] {
    return this.turnManager.getMoves(
      state ?? store.getState().field,
      state?.getFigure(fromX, fromY) ?? getFigureFromState(fromX, fromY),
      fromX,
      fromY,
    );
  }

  setState(newState: FieldState): void {
    this.state = newState;
    this.onChange.notify(newState);
    store.dispatch(makeMove(newState));
  }

  getGameMode(): GameMode {
    return this.gameMode;
  }
}
