import CellModel from '../cell/cell';
import CellView from '../cell/cell-view';
import Vector from '../components/vector';
import FieldState from '../state/field-state';
import FieldModel from './field-model';
import FieldView from './field-view';
import { socket } from '../../../reg-page/start-page-view';

const initialField = [
  'lneqkenl',
  'pppppppp',
  '        ',
  '        ',
  '        ',
  '        ',
  'PPPPPPPP',
  'LNEQKENL',
];
export default class ChessField {
  view: FieldView;

  model: FieldModel;

  private selectedCell: CellModel = null;

  constructor(parentNode: HTMLElement) {
    this.view = new FieldView(parentNode);
    this.model = new FieldModel(this.view.rotate);
    this.view.onCellClick = (cell: CellView, i: number, j: number) =>
      this.cellClickHandler(cell, i, j);
    // socket.onmessage = (msg) => {
    //   const parsed = JSON.parse(msg.data);
    //   console.log(parsed.state);
    //   if (parsed.type === 'move') {
    //     store.dispatch(makeMove(parsed.state));
    //   }
    // };
    this.model.onChange.add((state: FieldState) => this.view.refresh(state));
    this.model.onCheck.add((vector: Vector) => this.setCheck(vector));
    this.model.setFromStrings(initialField);
  }

  cellClickHandler(cell: CellView, i: number, j: number): void {
    let cellPos = this.getCellPosition(this.selectedCell);
    if (cellPos && cellPos.x === i && cellPos.y === j) {
      this.selectedCell = null;
      this.setSelection(null);
      this.setAllowed([]);
    } else {
      if (this.selectedCell) {
        cellPos = this.getCellPosition(this.selectedCell);
        this.model.move(cellPos.x, cellPos.y, i, j);
        this.forEachCell((currentCell) => currentCell.highlightAllowedMoves(false));
      }
      this.setSelection(cell);
      this.selectedCell = this.model.state.getCellAt(i, j);
    }
    if (this.selectedCell && this.selectedCell.getFigure()) {
      cellPos = this.getCellPosition(this.selectedCell);
      const allowed: Array<{ x: number; y: number }> = this.model.getAllowed(cellPos.x, cellPos.y);
      this.setAllowed(allowed.map((it) => new Vector(it.x, it.y)));
    } else {
      this.setAllowed([]);
    }
  }

  setSelection(selection: CellView): void {
    this.forEachCell((cell) => {
      if (selection && selection === cell) {
        cell.highlightSelectedCell(true);
      } else {
        cell.highlightSelectedCell(false);
      }
    });
  }

  setCheck(selection: Vector): void {
    if (!selection) {
      this.forEachCell((cell, pos) => {
        cell.highlightCheck(false);
      });
      return;
    }

    this.forEachCell((cell, pos) => {
      const isAllowed = selection.x === pos.x && selection.y === pos.y;
      if (isAllowed) {
        cell.highlightCheck(true);
      } else {
        cell.highlightCheck(false);
      }
    });
  }

  setAllowed(selection: Array<Vector>): void {
    this.forEachCell((cell, pos) => {
      const isAllowed = selection.findIndex((ax) => ax.x === pos.x && ax.y === pos.y) !== -1;
      if (isAllowed) {
        cell.highlightAllowedMoves(true);
      } else {
        cell.highlightAllowedMoves(false);
      }
    });
  }

  forEachCell(callback: (cell: CellView, position: Vector) => void): void {
    this.view.getCells().forEach((it, cellIndex) => {
      const x = Math.floor(cellIndex / 8);
      const y = cellIndex % 8;
      callback(it, new Vector(x, y));
    });
  }

  getCellPosition(cell: CellModel): Vector {
    let res = null;
    if (cell === null) {
      return null;
    }
    this.forEachCell((currentCell, pos) => {
      if (this.model.getCellAt(pos) === cell) {
        res = pos;
      }
    });
    return res;
  }

  rotate(): void {
    this.view.toggleClass('rotate');
  }
}
