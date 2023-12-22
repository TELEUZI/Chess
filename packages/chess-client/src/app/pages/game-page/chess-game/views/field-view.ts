import type { Coordinate } from '@chess/coordinate';
import BaseComponent from '@client/app/components/base-component';
import { TABLE_SIZE } from '@chess/config';
import { forEachCell, type FieldState } from '@chess/game-engine';
import CellView from './cell-view';

const TABLE_COORDINATES =
  '<svg viewBox="0 0 100 100" class="coordinates outside"><text x="2" y="3.5" font-size="3.1" class="coordinate-grey">8</text><text x="2" y="16" font-size="3.1" class="coordinate-grey">7</text><text x="2" y="28.5" font-size="3.1" class="coordinate-grey">6</text><text x="2" y="41" font-size="3.1" class="coordinate-grey">5</text><text x="2" y="53.5" font-size="3.1" class="coordinate-grey">4</text><text x="2" y="66" font-size="3.1" class="coordinate-grey">3</text><text x="2" y="78.5" font-size="3.1" class="coordinate-grey">2</text><text x="2" y="91" font-size="3.1" class="coordinate-grey">1</text><text x="10.35" y="99.25" font-size="3.1" class="coordinate-grey">a</text><text x="22.85" y="99.25" font-size="3.1" class="coordinate-grey">b</text><text x="35.35" y="99.25" font-size="3.1" class="coordinate-grey">c</text><text x="47.85" y="99.25" font-size="3.1" class="coordinate-grey">d</text><text x="60.35" y="99.25" font-size="3.1" class="coordinate-grey">e</text><text x="72.85" y="99.25" font-size="3.1" class="coordinate-grey">f</text><text x="85.35" y="99.25" font-size="3.1" class="coordinate-grey">g</text><text x="97.85" y="99.25" font-size="3.1" class="coordinate-grey">h</text></svg>';

const getCellColorClass = (x: number, y: number): string => {
  return (y % 2 && x % 2) || (!(y % 2) && !(x % 2)) ? 'cell cell__light' : 'cell cell__dark';
};

type SvgInHtml = HTMLElement & SVGElement;

export default class FieldView extends BaseComponent {
  private readonly cells: CellView[] = [];

  constructor(
    parentNode: HTMLElement,
    private readonly onCellClick: (cell: CellView, i: number, j: number) => Promise<void>,
  ) {
    super({
      className: 'table',
      parent: parentNode,
    });
    for (let i = 0; i < TABLE_SIZE; i += 1) {
      const row = new BaseComponent({
        className: 'row',
        parent: this.node,
      });
      for (let j = 0; j < TABLE_SIZE; j += 1) {
        const cell = new CellView(getCellColorClass(i, j), async () => {
          await this.onCellClick(cell, i, j);
        });
        row.append(cell);

        this.cells.push(cell);
      }
    }
    const numbers = document.createElement('svg') as SvgInHtml;
    this.node.append(numbers);
    numbers.outerHTML = TABLE_COORDINATES;
  }

  public getCells(): CellView[] {
    return this.cells;
  }

  public refresh(field: FieldState): void {
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const cellTo = field.getCellAt(pos.x, pos.y);
      const figureType = cellTo?.getFigureType();
      const figureColor = cellTo?.getFigureColor();
      if (figureType != null && figureColor != null) {
        cell.refresh(figureType, figureColor);
      } else {
        cell.destroyFigure();
      }
    });
  }

  public setSelection(selection: CellView | null): void {
    forEachCell(this.cells, (cell) => {
      const isSameCell = selection && selection === cell;
      cell.highlightSelectedCell(Boolean(isSameCell));
    });
  }

  public setCheck(selection: Coordinate | null): void {
    if (!selection) {
      forEachCell<CellView>(this.cells, (cell) => {
        cell.highlightCheck(false);
      });
      return;
    }
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const isAllowed = pos.equals(selection);
      cell.highlightCheck(isAllowed);
    });
  }

  public setMate(selection: Coordinate | null): void {
    if (!selection) {
      forEachCell<CellView>(this.cells, (cell) => {
        cell.highlightMate(false);
      });
      return;
    }
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const isAllowed = pos.equals(selection);
      cell.highlightMate(isAllowed);
    });
  }

  public setAllowedMoves(selection: Coordinate[]): void {
    forEachCell<CellView>(this.cells, (cell, pos) => {
      const isAllowed = selection.findIndex((move) => move.equals(pos)) !== -1;
      cell.highlightAllowedMoves(isAllowed);
    });
  }

  public rotate(): void {
    this.node.classList.toggle('rotate');
  }

  // destroyCells(): void {
  //   this.cells.forEach((cell) => {
  //     cell.destroy();
  //   });
  // }
}
