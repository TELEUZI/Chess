import type { Coordinate } from '@chess/coordinate';
import GameMode from '@client/app/enums/game-mode';
import FigureType from '@client/app/enums/figure-type';
import { socketService } from '@client/app/services/websocket-service';
import ConfigDaoService from '@client/app/services/config-dao-service';
import { BLACK_ROW_INDEX, WHITE_ROW_INDEX } from '@client/app/config';
import type { Strategy } from '@client/app/pages/game-page/chess-game/services/chess-bot/bot-strategy';
import type TurnInfo from '@client/app/interfaces/turn-info';
import { FigureColor } from '@chess/game-common';
import { storeService } from '@client/app/pages/game-page/chess-game/state/store-service';
import type CellModel from '../models/cell-model';
import type CellView from '../views/cell-view';
import type FieldState from '../state/field-state';
import FieldView from '../views/field-view';
import FieldModel from './field-model';
import ChessBot from '../services/chess-bot/chess-bot';
import forEachCell from '../utils/cells-iterator';
import createStrategy from '../fabrics/bot-strategy-fabric';

export default class ChessField {
  private readonly model: FieldModel;

  private readonly view: FieldView;

  private selectedCell: CellModel | null = null;

  private bot: ChessBot | null = null;

  private readonly botConfigService: ConfigDaoService = ConfigDaoService.getInstance();

  private readonly onMate: () => void;

  private readonly onStalemate: () => void;

  private readonly onNextTurn: () => void;

  private readonly onEnd: () => void;

  private readonly onFieldUpdate: (turnInfo: TurnInfo) => void;

  private readonly unsubscribe: (() => void) | null = null;

  constructor({
    parentNode,
    onMate,
    onStalemate,
    onNextTurn,
    onEnd,
    onFieldUpdate,
  }: {
    parentNode: HTMLElement;
    onMate: () => void;
    onStalemate: () => void;
    onNextTurn: () => void;
    onEnd: () => void;
    onFieldUpdate: (turnInfo: TurnInfo) => void;
  }) {
    this.onMate = onMate;
    this.onStalemate = onStalemate;
    this.onNextTurn = onNextTurn;
    this.onEnd = onEnd;
    this.onFieldUpdate = onFieldUpdate;
    this.model = new FieldModel({
      onCheckPromotion: (cell: CellModel) => {
        if (this.shouldPromote(cell)) {
          const cellPosition = this.getCellPosition(cell);
          if (cellPosition) {
            this.model.promote(cellPosition.x, cellPosition.y);
          }
        }
      },
      onSinglePlayerMove: () => {
        this.view.rotate();
        forEachCell(this.view.getCells(), (cell) => {
          cell.rotate();
        });
      },
      onBotMove: () => {
        this.bot?.makeBotMove(this.model.state, FigureColor.BLACK);
      },
      onReset: () => {
        storeService.setCurrentUserColor(FigureColor.WHITE);
      },
      onStalemate: () => {
        this.onStalemate();
        this.onEnd();
      },
    });
    void this.getBotStrategy()
      .then((strategy) => {
        this.bot = new ChessBot(this.model, strategy);
      })
      .catch();
    this.model.onNextTurn.subscribe(() => {
      this.onNextTurn();
    });
    this.view = new FieldView(parentNode, async (cell: CellView, i: number, j: number) => {
      await this.cellClickHandler(cell, i, j);
    });
    this.view.refresh(storeService.getFieldState());
    this.unsubscribe = storeService.subscribeToFieldState(() => {
      this.view.refresh(storeService.getFieldState());
    });
    socketService.onStart = () => {
      if (storeService.getUserColor() === FigureColor.BLACK) {
        this.view.rotate();
        forEachCell(this.view.getCells(), (cell) => {
          cell.rotate();
        });
      }
    };
    this.model.onChange.subscribe((state: FieldState) => {
      this.view.refresh(state);
    });
    this.model.onCheck.subscribe((vector) => {
      if (vector) {
        this.view.setCheck(vector);
      }
    });
    this.model.onMate.subscribe((attackingFigureCell) => {
      if (!attackingFigureCell) {
        return;
      }
      this.view.setMate(attackingFigureCell);
      this.onMate();
      this.onEnd();
    });
    this.model.onMove.subscribe((turnInfo: TurnInfo) => {
      this.onFieldUpdate(turnInfo);
    });
  }

  public makeMove(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    return this.model.makeMove(fromX, fromY, toX, toY);
  }

  public destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private async getBotStrategy(): Promise<Strategy | null> {
    return createStrategy(await this.botConfigService.getData());
  }

  private async cellClickHandler(cell: CellView, i: number, j: number): Promise<void> {
    if (
      storeService.getCurrentPlayerColor() !== storeService.getUserColor() &&
      this.model.getGameMode() === GameMode.MULTIPLAYER
    ) {
      return;
    }
    let cellPos = this.getCellPosition(this.selectedCell);
    if (cellPos) {
      await this.model.moveFigure(cellPos.x, cellPos.y, i, j);
      forEachCell(this.view.getCells(), (currentCell) => {
        currentCell.highlightSelectedCell(false);
        currentCell.highlightAllowedMoves(false);
      });
      this.selectedCell = null;
    }
    if (cellPos && cellPos.x === i && cellPos.y === j) {
      this.selectedCell = null;
      this.view.setSelection(null);
      this.view.setAllowedMoves([]);
    } else {
      this.view.setSelection(cell);
      this.selectedCell = this.model.state.getCellAt(i, j);
    }
    if (this.selectedCell?.getFigure()) {
      cellPos = this.getCellPosition(this.selectedCell);
      if (!cellPos) {
        return;
      }
      const allowedMoves: Coordinate[] = this.model.getAllowedMovesFromPoint(cellPos.x, cellPos.y);
      this.view.setAllowedMoves(allowedMoves);
    } else {
      this.view.setAllowedMoves([]);
    }
  }

  private getCellPosition(cell: CellModel | null): Coordinate | null {
    let res: Coordinate | null = null;
    if (cell === null) {
      return null;
    }
    forEachCell<CellView>(this.view.getCells(), (_, pos) => {
      if (this.model.getCellAt(pos) === cell) {
        res = pos;
      }
    });
    return res;
  }

  private shouldPromote(cell: CellModel): boolean {
    if (cell.getFigureType() === FigureType.PAWN) {
      if (
        cell.getFigureColor() === FigureColor.WHITE &&
        this.getCellPosition(cell)?.x === BLACK_ROW_INDEX
      ) {
        return true;
      }
      if (
        cell.getFigureColor() === FigureColor.BLACK &&
        this.getCellPosition(cell)?.x === WHITE_ROW_INDEX
      ) {
        return true;
      }
    }
    return false;
  }
}
