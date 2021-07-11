import BaseComponent from '../../../../base-component';
import CellView from '../cell/cell-view';
import Vector from '../components/vector';
import FieldState from '../state/field-state';

export default class FieldView extends BaseComponent {
  private cells: Array<CellView> = [];

  onCellClick: (cell: CellView, i: number, j: number) => void;

  getCells(): Array<CellView> {
    return this.cells;
  }

  constructor(parentNode: HTMLElement) {
    super('div', ['table'], '', parentNode);
    for (let i = 0; i < 8; i += 1) {
      const row = new BaseComponent('div', ['row'], '', this.node);
      for (let j = 0; j < 8; j += 1) {
        const cell = new CellView(row.getNode());
        cell.setClasses(
          (j % 2 && i % 2) || (!(j % 2) && !(i % 2)) ? 'cell cell__light' : 'cell cell__dark',
        );
        cell.onClick = () => {
          this.onCellClick(cell, i, j);
        };
        this.cells.push(cell);
      }
    }
  }

  refresh(field: FieldState): void {
    this.forEachCell((cell, pos) => {
      cell.refresh(
        field.getCellAt(pos.x, pos.y).getFigureType(),
        field.getCellAt(pos.x, pos.y).getFigureColor(),
      );
    });
    // this.rotate();
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
    this.cells.forEach((it, cellIndex) => {
      const x = Math.floor(cellIndex / 8);
      const y = cellIndex % 8;
      callback(it, new Vector(x, y));
    });
  }

  rotate(): void {
    this.node.classList.toggle('rotate');
  }
}
