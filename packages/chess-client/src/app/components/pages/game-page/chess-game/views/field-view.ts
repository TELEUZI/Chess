import type { Coordinate } from '@coordinate';
import BaseComponent from '../../../../base-component';
import CellView from './cell-view';
import type FieldState from '../state/field-state';
import { TABLE_SIZE } from '../../../../../config';
import forEachCell from '../utils/cells-iterator';

const TABLE_COORDINATES = `<svg viewBox="0 0 100 100" class="coordinates outside"><text x="2" y="3.5" font-size="3.1" class="coordinate-grey">8</text><text x="2" y="16" font-size="3.1" class="coordinate-grey">7</text><text x="2" y="28.5" font-size="3.1" class="coordinate-grey">6</text><text x="2" y="41" font-size="3.1" class="coordinate-grey">5</text><text x="2" y="53.5" font-size="3.1" class="coordinate-grey">4</text><text x="2" y="66" font-size="3.1" class="coordinate-grey">3</text><text x="2" y="78.5" font-size="3.1" class="coordinate-grey">2</text><text x="2" y="91" font-size="3.1" class="coordinate-grey">1</text><text x="10.35" y="99.25" font-size="3.1" class="coordinate-grey">a</text><text x="22.85" y="99.25" font-size="3.1" class="coordinate-grey">b</text><text x="35.35" y="99.25" font-size="3.1" class="coordinate-grey">c</text><text x="47.85" y="99.25" font-size="3.1" class="coordinate-grey">d</text><text x="60.35" y="99.25" font-size="3.1" class="coordinate-grey">e</text><text x="72.85" y="99.25" font-size="3.1" class="coordinate-grey">f</text><text x="85.35" y="99.25" font-size="3.1" class="coordinate-grey">g</text><text x="97.85" y="99.25" font-size="3.1" class="coordinate-grey">h</text></svg>`;

const getCellColorClass = (x: number, y: number): string => {
  return (y % 2 && x % 2) || (!(y % 2) && !(x % 2)) ? 'cell cell__light' : 'cell cell__dark';
};

type SvgInHtml = HTMLElement & SVGElement;

export default class FieldView extends BaseComponent {
  private readonly cells: CellView[] = [];

  getCells(): CellView[] {
    return this.cells;
  }

  constructor(
    parentNode: HTMLElement,
    private readonly onCellClick: (cell: CellView, i: number, j: number) => void,
  ) {
    super('div', ['table'], '', parentNode);
    for (let i = 0; i < TABLE_SIZE; i += 1) {
      const row = new BaseComponent('div', ['row'], '', this.node);
      for (let j = 0; j < TABLE_SIZE; j += 1) {
        const cell = new CellView(row.getNode(), getCellColorClass(i, j), () => {
          this.onCellClick(cell, i, j);
        });

        this.cells.push(cell);
      }
    }
    const numbers = document.createElement('svg') as SvgInHtml;
    this.node.append(numbers);
    numbers.outerHTML = TABLE_COORDINATES;
  }

  refresh(field: FieldState): void {
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const cellTo = field.getCellAt(pos.x, pos.y);
      const figureType = cellTo?.getFigureType();
      const figureColor = cellTo?.getFigureColor();
      if (figureType && figureColor) {
        cell.refresh(figureType, figureColor);
      }
    });
  }

  setSelection(selection: CellView | null): void {
    forEachCell(this.cells, (cell) => {
      const isSameCell = selection && selection === cell;
      cell.highlightSelectedCell(!!isSameCell);
    });
  }

  setCheck(selection: Coordinate | null): void {
    if (!selection) {
      forEachCell<CellView>(this.cells, (cell) => {
        cell.highlightCheck(false);
      });
      return;
    }
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const isAllowed = pos.equals(selection);
      cell.highlightCheck(!!isAllowed);
    });
  }

  setMate(selection: Coordinate | null): void {
    if (!selection) {
      forEachCell<CellView>(this.cells, (cell) => {
        cell.highlightMate(false);
      });
      return;
    }
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const isAllowed = pos.equals(selection);
      cell.highlightMate(!!isAllowed);
    });
  }

  setAllowedMoves(selection: Coordinate[]): void {
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const isAllowed = selection.findIndex((move) => move.equals(pos)) !== -1;
      cell.highlightAllowedMoves(!!isAllowed);
    });
  }

  rotate(): void {
    this.node.classList.toggle('rotate');
  }

  // destroyCells(): void {
  //   this.cells.forEach((cell) => {
  //     cell.destroy();
  //   });
  // }
}
