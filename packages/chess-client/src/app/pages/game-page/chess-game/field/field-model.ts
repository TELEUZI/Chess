import { Coordinate } from '@coordinate';
import GameMode from '@client/app/enums/game-mode';
import { socketService } from '@client/app/services/websocket-service';
import getNextFigureColor from '@client/app/utils/get-next-figure-color';
import type { FigureTurn } from '@client/app/interfaces/move-message';
import type MoveMessage from '@client/app/interfaces/move-message';
import Observable from '@client/app/services/observable';
import type { GameResult } from '@client/app/interfaces/replay';
import { getOpeningName, getOpenings } from '@client/app/services/chess-openings-service';
import type TurnInfo from '@client/app/interfaces/turn-info';
import FigureType from '@client/app/enums/figure-type';
import { INIT_FIELD_STATE } from '@client/app/config';
import { Subject } from '@client/app/services/subject';
import type ChessOpening from '@client/app/interfaces/chess-opening';
import { FigureColor } from '@chess/game-common';
import type CellModel from '../models/cell-model';

import type FieldState from '../state/field-state';
import store from '../state/redux/store';
import createFieldFromStrings from '../fabrics/field-fabric';
import * as TurnManager from '../services/figure-moves/turn-manager';
import { createFigureFromString } from '../fabrics/figure-fabric';
import {
  getKingPosition,
  forEachPlayerFigure,
  getStateAfterMove,
  getFigureFromState,
} from '../services/field-service/field-service';
import { setCurrentUserColor, makeMove } from '../state/redux/action-creators';
import { getBoardFromFen, getFenFromStringBoard } from '../utils/fen-processor';

interface FieldModelProps {
  onStalemate: () => void;
  onBotMove: () => void;
  onSinglePlayerMove: () => void;
  onReset: () => void;
  onCheckPromotion: (cell: CellModel) => void;
}
function getMovesAtPoint(fromX: number, fromY: number, state?: FieldState): Coordinate[] {
  return TurnManager.getMoves(
    state ?? store.getState().field,
    state?.getFigure(fromX, fromY) ?? getFigureFromState(fromX, fromY),
    fromX,
    fromY,
  );
}
function getEnemyFigures(state: FieldState, color: number): { x: number; y: number }[] {
  const res: { x: number; y: number }[] = [];
  forEachPlayerFigure(state, color, (_, pos) => {
    if (getMovesAtPoint(pos.x, pos.y, state).length) {
      res.push(pos);
    }
  });
  return res;
}

export default class FieldModel {
  public state: FieldState;

  public onChange = new Observable<FieldState>();

  public onCheck = new Subject<Coordinate | null>(null);

  public onMate = new Subject<Coordinate | null>(null);

  public onMove = new Observable<TurnInfo>();

  public onNextTurn = new Observable<void>();

  private currentColor = FigureColor.WHITE;

  private readonly gameMode: GameMode = GameMode.SINGLE;

  private gameResult?: GameResult;

  private readonly onStalemate: () => void;

  private readonly onBotMove: () => void;

  private readonly onSinglePlayerMove: () => void;

  private readonly onReset: (result?: string) => void;

  private readonly onCheckPromotion: (cell: CellModel) => void;

  private readonly openings: Promise<ChessOpening[]> = getOpenings();

  constructor({
    onStalemate,
    onBotMove,
    onSinglePlayerMove,
    onReset,
    onCheckPromotion,
  }: FieldModelProps) {
    this.onStalemate = onStalemate;
    this.onBotMove = onBotMove;
    this.onSinglePlayerMove = onSinglePlayerMove;
    this.onReset = onReset;
    this.onCheckPromotion = onCheckPromotion;
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
      this.setState(createFieldFromStrings(newState));
      this.currentColor = currentColor;
    };
  }

  public promote(i: number, j: number): void {
    this.state.setFigureAtCell(
      createFigureFromString(
        this.getCellAt(new Coordinate(i, j))?.getFigureColor() === FigureColor.WHITE
          ? FigureType.QUEEN.toUpperCase()
          : FigureType.QUEEN,
      ),
      i,
      j,
    );
    store.dispatch(makeMove(this.state));
  }

  public checkGameSituation(): void {
    const isMoves = this.getAllValidMoves(this.state, this.currentColor).length !== 0;
    const kingPosition = getKingPosition(this.state, this.currentColor);
    if (!isMoves && this.getCheckedKing(this.state)) {
      this.onMate.notify(kingPosition);
      this.gameResult = this.currentColor;
      this.onReset(this.gameResult.toString());
    } else if (!isMoves && !this.getCheckedKing(this.state)) {
      this.onStalemate();
      this.gameResult = 'draw';
      this.onReset(this.gameResult);
    } else if (this.getCheckedKing(this.state)) {
      this.onCheck.notify(kingPosition);
    }
  }

  public async moveFigure(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    const allowed = this.getAllowedMovesFromPoint(fromX, fromY);
    const isAllowed = allowed.findIndex((it) => {
      return it.x === toX && it.y === toY;
    });
    if (isAllowed === -1 || (fromX === toX && fromY === toY)) {
      this.checkGameSituation();
      return;
    }
    await this.makeMove(fromX, fromY, toX, toY);
    if (this.gameMode === GameMode.SINGLE) {
      this.onSinglePlayerMove();
    } else if (this.gameMode === GameMode.BOT) {
      this.onBotMove();
    } else if (this.gameMode === GameMode.MULTIPLAYER) {
      await socketService.move(getFenFromStringBoard(this.state.getPlainState()), {
        from: new Coordinate(fromX, fromY),
        to: new Coordinate(toX, toY),
      });
    }
    const cell = this.getCellAt(new Coordinate(toX, toY));
    if (cell) {
      this.onCheckPromotion(cell);
    }
    this.setNextPlayerColor();
    this.checkGameSituation();
  }

  public async makeMove(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
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
    const isOpening = getOpeningName(await this.openings, fenState);
    const move: TurnInfo = {
      figure: this.state.getCellAt(toX, toY)?.getFigureExternalInfo(),
      move: { from: new Coordinate(fromX, fromY), to: new Coordinate(toX, toY) },
      ...(isOpening && { comment: isOpening }),
    };
    this.checkGameSituation();
    this.onMove.notify(move);
  }

  public getCellAt(to: Coordinate): CellModel | null {
    return this.state.getCellAt(to.x, to.y);
  }

  public getAllValidMoves(state: FieldState, color: FigureColor): FigureTurn[] {
    const moves: FigureTurn[] = [];
    const kingPos = getKingPosition(state, color);
    forEachPlayerFigure(state, color, (_, pos) => {
      if (getMovesAtPoint(pos.x, pos.y, state).length) {
        moves.push({ from: pos, to: getMovesAtPoint(pos.x, pos.y, state) });
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

  public getAllowedMovesFromPoint = (fromX: number, fromY: number): Coordinate[] => {
    if (
      this.state.getFigure(fromX, fromY) &&
      this.state.getFigureColor(fromX, fromY) === store.getState().currentPlayer.currentUserColor &&
      (this.gameMode === GameMode.SINGLE ||
        store.getState().currentPlayer.currentUserColor === store.getState().color.color)
    ) {
      let moves: Coordinate[] = getMovesAtPoint(fromX, fromY);
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

  public getGameMode(): GameMode {
    return this.gameMode;
  }

  private setNextPlayerColor(): void {
    if (this.gameMode === GameMode.SINGLE) {
      store.dispatch(
        setCurrentUserColor(getNextFigureColor(store.getState().currentPlayer.currentUserColor)),
      );
    }
    this.currentColor = store.getState().currentPlayer.currentUserColor;
  }

  private getCheckedKing(state: FieldState): boolean {
    const kingPos = getKingPosition(state, this.currentColor);
    if (!kingPos) {
      return false;
    }
    return this.getCheckedStatus(state, kingPos.x, kingPos.y).isChecked;
  }

  private getCheckedStatus(
    state: FieldState,
    posX: number,
    posY: number,
  ): { isChecked: boolean; attackingFigure: null } {
    let res = false;
    let enemyCell: Coordinate | null = null;
    const enemies = getEnemyFigures(state, getNextFigureColor(this.currentColor));
    enemies.forEach((enemy) => {
      const allowed = getMovesAtPoint(enemy.x, enemy.y, state);
      allowed.forEach((al) => {
        if (al.x === posX && al.y === posY) {
          res = true;
          enemyCell = new Coordinate(enemy.x, enemy.y);
        }
      });
    });
    return { isChecked: res, attackingFigure: enemyCell };
  }

  private setState(newState: FieldState): void {
    this.state = newState;
    this.onChange.notify(newState);
    store.dispatch(makeMove(newState));
  }
}
