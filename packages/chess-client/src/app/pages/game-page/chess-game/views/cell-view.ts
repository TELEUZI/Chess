import BaseComponent from '@client/app/components/base-component';
import { FigureColor } from '@chess/game-common';
import { FigureColorLetter } from '@chess/game-engine';
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

  public highlightSelectedCell(state: boolean): void {
    if (state) {
      this.addClass('cell__selected');
    } else {
      this.removeClass('cell__selected');
    }
  }

  public highlightAllowedMoves(state: boolean): void {
    if (state) {
      this.addClass('cell__allowed');
    } else {
      this.removeClass('cell__allowed');
    }
  }

  public highlightCheck(state: boolean): void {
    if (state) {
      this.addClass('cell__check');
    } else {
      this.removeClass('cell__check');
    }
  }

  public highlightMate(state: boolean): void {
    if (state) {
      this.addClass('cell__mate');
    } else {
      this.removeClass('cell__mate');
    }
  }

  public refresh(type: string, color: FigureColor): void {
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

  public rotate(): void {
    this.toggleClass('rotate');
  }

  public destroyFigure(): void {
    this.figure.destroy();
  }

  private setFigure(type: string, color: FigureColor): void {
    if (type && type !== ' ') {
      this.figure.destroy();
      this.figure = new Figure(this.node, [
        'chess__figure',
        `chess-field__${
          color === FigureColor.BLACK ? FigureColorLetter.BLACK : FigureColorLetter.WHITE
        }${type}`,
      ]);
      this.figure.setAttribute('draggable', 'true');
    } else {
      this.figure.setClassname('');
    }
  }
}
