import BaseComponent from '../../../../base-component';
import Figure from './figure-view';

export default class CellView extends BaseComponent {
  onClick: () => void;

  private figure: Figure;

  constructor(parentNode: HTMLElement) {
    super('div', ['cell'], '', parentNode);
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

  refresh(type: string, color: number): void {
    this.setFigure(type, color);
    if (!type) {
      return;
    }
    if (color === 0) {
      this.addClass('cell__figureBlack');
      this.removeClass('cell__figureWhite');
      this.addClass('rotate');
    } else {
      this.addClass('cell__figureWhite');
      this.removeClass('rotate');
      this.removeClass('cell__figureBlack');
    }
  }

  private setFigure(type: string, color: number): void {
    if (type && type && type !== ' ') {
      this.figure.destroy();
      this.figure = new Figure(this.node, [`chess_fig`, `chess__${color ? 'b' : 'w'}${type}`]);
      this.figure.setAttribute('draggable', 'true');
    } else {
      this.figure.setClassname('');
    }
  }

  rotate(): void {
    this.toggleClass('rotate');
  }

  getFigure(): Figure {
    return this.figure;
  }
}
