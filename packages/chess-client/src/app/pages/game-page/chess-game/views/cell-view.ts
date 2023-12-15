import FigureColorLetter from '@client/app/enums/figure-color-letter';
import FigureColor from '@client/app/enums/figure-colors';
import BaseComponent from '@client/app/components/base-component';
import Figure from './figure-view';

export default class CellView extends BaseComponent {
  private figure: Figure;

  constructor(
    parentNode: HTMLElement,
    className: string,
    private readonly onClick: () => void,
  ) {
    super({ tag: 'div', className: `cell ${className}`, parent: parentNode });
    this.figure = new Figure(this.node, []);
    this.node.onclick = () => {
      this.onClick();
    };
  }

  highlightSelectedCell(state: boolean): void {
    if (state) {
      this.addClass('cell__selected');
    } else {
      this.removeClass('cell__selected');
    }
  }

  highlightAllowedMoves(state: boolean): void {
    if (state) {
      this.addClass('cell__allowed');
    } else {
      this.removeClass('cell__allowed');
    }
  }

  highlightCheck(state: boolean): void {
    if (state) {
      this.addClass('cell__check');
    } else {
      this.removeClass('cell__check');
    }
  }

  highlightMate(state: boolean): void {
    if (state) {
      this.addClass('cell__mate');
    } else {
      this.removeClass('cell__mate');
    }
  }

  refresh(type: string, color: FigureColor): void {
    this.setFigure(type, color);
    if (!type) {
      return;
    }
    if (color === FigureColor.BLACK) {
      this.addClass('cell__figureBlack');
      this.removeClass('cell__figureWhite');
    } else {
      this.addClass('cell__figureWhite');
      this.removeClass('cell__figureBlack');
    }
  }

  private setFigure(type: string, color: FigureColor): void {
    if (type && type !== ' ') {
      this.figure.destroy();
      this.figure = new Figure(this.node, [
        `chess__figure`,
        `chess-field__${
          color === FigureColor.BLACK ? FigureColorLetter.BLACK : FigureColorLetter.WHITE
        }${type}`,
      ]);
      this.figure.setAttribute('draggable', 'true');
    } else {
      this.figure.setClassname('');
    }
  }

  rotate(): void {
    this.toggleClass('rotate');
  }

  destroyFigure(): void {
    this.figure.destroy();
  }
}
