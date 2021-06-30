import BaseComponent from '../../../../base-component';
import CellModel from '../cell/cell';
import CellView from '../cell/cell-view';
import Vector from '../components/vector';
import FieldState from '../state/field-state';
import store from '../state/redux/store';
import FieldModel from './field-model';

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
export default class ChessField extends BaseComponent {
  private cells: Array<CellView> = [];

  model: FieldModel = new FieldModel(this.rotate.bind(this));

  private selectedCell: CellModel = null;

  constructor(parentNode: HTMLElement) {
    super('div', ['table'], '', parentNode);
    this.testItem = new BaseComponent('div', ['cell', 'cell__light'], '', this.node);
    for (let i = 0; i < 8; i += 1) {
      const row = new BaseComponent('div', ['row'], '', this.node);
      for (let j = 0; j < 8; j += 1) {
        const cell = new CellView(row.getNode());
        cell.setClasses(
          (j % 2 && i % 2) || (!(j % 2) && !(i % 2)) ? 'cell cell__light' : 'cell cell__dark',
        );
        cell.onClick = () => {
          let cellPos = this.getCellPosition(this.selectedCell);
          if (cellPos && cellPos.x === i && cellPos.y === j) {
            this.selectedCell = null;
            this.setSelection(null);
            this.setAllowed([]);
          } else {
            if (this.selectedCell) {
              cellPos = this.getCellPosition(this.selectedCell);
              this.model.move(cellPos.x, cellPos.y, i, j);
            }
            this.setSelection(cell);
            this.selectedCell = this.model.state.getCellAt(i, j);
          }
          if (this.selectedCell && this.selectedCell.getFigure()) {
            cellPos = this.getCellPosition(this.selectedCell);
            const allowed: Array<{ x: number; y: number }> = this.model.getAllowed(
              store.getState().field,
              cellPos.x,
              cellPos.y,
            );
            this.setAllowed(allowed.map((it) => new Vector(it.x, it.y)));
          } else {
            this.setAllowed([]);
          }
        };
        this.cells.push(cell);
      }
    }
    // this.node.style.display = 'none';
    // this.testItem = null;
    // this.node.onmousedown = (e) => {
    //   e.preventDefault();
    //   if (e.buttons === 1) {
    //     const fieldBox = this.node.getBoundingClientRect();
    //     const ratio = Math.floor(fieldBox.width / 8);
    //     this.startChildPos = new Vector(
    //       Math.floor((e.clientX - this.node.offsetLeft) / ratio),
    //       Math.floor((e.clientY - this.node.offsetTop) / ratio),
    //     );
    //     this.startCellPos = new Vector(
    //       Math.floor((e.clientX - this.node.offsetLeft) / ratio),
    //       Math.floor((e.clientY - this.node.offsetTop) / ratio),
    //     );
    //     this.onFigureGrab(this.startCellPos);
    //   }
    // };

    // // this.element.onmouseenter = (e: MouseEvent) => {
    // //   if (e.buttons != 1) {
    // //     this.dragableField.element.onmouseup(e);
    // //   }
    // // };

    // this.node.onmousemove = (e: MouseEvent) => {
    //   if (e.buttons === 1) {
    //     if (this.testItem) {
    //       const movePos = new Vector(
    //         e.clientX - this.node.offsetLeft,
    //         e.clientY - this.node.offsetTop,
    //       ).sub(this.startChildPos);
    //       this.testItem.element.style.left = `${movePos.x}px`;
    //       this.testItem.element.style.top = `${movePos.y}px`;
    //     }
    //   }
    // };

    // this.node.onmouseup = (e) => {
    //   this.node.style.display = 'none';
    //   this.testItem = null;
    // };
    this.model.onChange.add((state: FieldState) => this.refresh());
    this.model.onCheck.add((vector: Vector) => this.setCheck(vector));
    this.model.setFromStrings(initialField);
  }
  // addItem(): void {
  //   const figPos = new Vector(i % 8, Math.floor(i / 8));
  //   let testItem = instance;
  //   testItem.element.style.left = figPos.x * parentNode.width + 'px';
  //   testItem.element.style.top = figPos.y * parentNode.height + 'px';
  //   testItem.onDragStart = (startPos: Vector) => {
  //     this.dragableField.element.style.display = '';
  //     this.startChildPos = startPos;
  //     this.testItem = testItem;
  //   };
  // }

  refresh(): void {
    this.forEachCell((cell, pos) => {
      cell.refresh(
        store.getState().field.getCellAt(pos.x, pos.y).getFigureType(),
        store.getState().field.getCellAt(pos.x, pos.y).getFigureColor(),
      );
    });
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

  getCellPosition(cell: CellModel): Vector {
    let res = null;
    if (cell === null) {
      return null;
    }
    this.forEachCell((currentCell, pos) => {
      if (this.model.getCellAt(this.model.state, pos) === cell) {
        res = pos;
      }
    });
    return res;
  }

  rotate(): void {
    this.node.classList.toggle('rotate');
  }
}
