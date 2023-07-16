import type { Coordinate } from '@coordinate';
import type CellModel from '../models/cell-model';
import type CellView from '../views/cell-view';
import type FieldState from '../state/field-state';
import FieldView from '../views/field-view';
import store from '../state/redux/store';
import FieldModel from './field-model';
import GameMode from '../../../../../enums/game-mode';
import ChessBot from './chess-bot';
import forEachCell from '../utils/cells-iterator';
import FigureType from '../../../../../enums/figure-type';
import FigureColor from '../../../../../enums/figure-colors';
import { socketService } from '../../../../../services/websocket-service';
import { setCurrentUserColor } from '../state/redux/action-creators';
import ConfigDaoService from '../../../../../services/config-dao-service';
import { BLACK_ROW_INDEX, WHITE_ROW_INDEX } from '../../../../../config';
import createStrategy from '../fabrics/bot-strategy-fabric';
import type { Strategy } from '../../../../../interfaces/bot-strategy';
import type TurnInfo from '../../../../../interfaces/turn-info';

export default class ChessField {
  model: FieldModel;

  private readonly view: FieldView;

  private selectedCell: CellModel | null = null;

  private bot: ChessBot | null = null;

  private readonly botConfigService: ConfigDaoService = ConfigDaoService.getInstance();

  onMate: () => void;

  onStalemate: () => void;

  onNextTurn: () => void;

  onFieldUpdate: (turnInfo: TurnInfo) => void;

  onEnd: () => void;

  constructor({ parentNode }: { parentNode: HTMLElement }) {
    this.model = new FieldModel();
    this.getBotStrategy().then((strategy) => {
      this.bot = new ChessBot(this.model, strategy);
    });
    this.model.onNextTurn.subscribe(() => {
      this.onNextTurn();
    });
    this.view = new FieldView(parentNode, (cell: CellView, i: number, j: number) => {
      this.cellClickHandler(cell, i, j);
    });
    this.view.refresh(store.getState().field);
    store.subscribe(() => {
      this.view.refresh(store.getState().field);
    });
    socketService.onStart = () => {
      if (store.getState().color.color === FigureColor.BLACK) {
        this.view.rotate();
        forEachCell(this.view.getCells(), (cell) => {
          cell.rotate();
        });
      }
    };
    this.setUpModelListeners();
    this.model.onChange.subscribe((state: FieldState) => {
      this.view.refresh(state);
    });
    this.model.onCheck.subscribe((vector: Coordinate) => {
      this.view.setCheck(vector);
    });
    this.model.onMate.subscribe((attackingFigureCell: Coordinate) => {
      this.view.setMate(attackingFigureCell);
      this.onMate();
      this.onEnd();
    });
  }

  setUpModelListeners(): void {
    this.model.onCheckPromotion = (cell: CellModel) => {
      if (this.checkPromotion(cell)) {
        const cellPosition = this.getCellPosition(cell);
        if (cellPosition) {
          this.model.promote(cellPosition.x, cellPosition.y);
        }
      }
    };
    this.model.onMove.subscribe((turnInfo: TurnInfo) => {
      this.onFieldUpdate(turnInfo);
    });
    this.model.onSinglePlayerMove = () => {
      this.view.rotate();
      forEachCell(this.view.getCells(), (cell) => {
        cell.rotate();
      });
    };
    this.model.onBotMove = () => {
      this.bot?.makeBotMove(this.model.state, FigureColor.BLACK);
    };
    this.model.onReset = () => {
      store.dispatch(setCurrentUserColor(1));
    };
    this.model.onStalemate = () => {
      this.onStalemate();
      this.onEnd();
    };
  }

  async getBotStrategy(): Promise<Strategy | null> {
    return createStrategy(await this.botConfigService.getData());
  }

  cellClickHandler(cell: CellView, i: number, j: number): void {
    if (
      store.getState().currentPlayer.currentUserColor !== store.getState().color.color &&
      this.model.getGameMode() === GameMode.MULTIPLAYER
    ) {
      return;
    }
    let cellPos = this.getCellPosition(this.selectedCell);
    if (cellPos) {
      this.model.moveFigure(cellPos.x, cellPos.y, i, j);
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
      const allowed: Coordinate[] = this.model.getAllowedMovesFromPoint(cellPos.x, cellPos.y);
      this.view.setAllowedMoves(allowed);
    } else {
      this.view.setAllowedMoves([]);
    }
  }

  getCellPosition(cell: CellModel | null): Coordinate | null {
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

  checkPromotion(cell: CellModel): boolean {
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
