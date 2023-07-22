import FigureColorLetter from '@client/app/enums/figure-color-letter';
import FigureColor from '@client/app/enums/figure-colors';
import type TurnInfo from '../../../interfaces/turn-info';
import BaseComponent from '../../../components/base-component';

import FigureView from './views/figure-view';

export const boardCoordsY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const boardCoordsX = ['8', '7', '6', '5', '4', '3', '2', '1'];

function deepEqual<T>(object: T, value: T): boolean {
  return JSON.stringify(object) === JSON.stringify(value);
}

export default class ChessHistory extends BaseComponent {
  private readonly historyWrapper: BaseComponent;

  private lastTurn: TurnInfo | null = null;

  constructor(parentNode: HTMLElement) {
    super('div', ['chess__history'], '', parentNode);
    const historyHeader = new BaseComponent('h3', ['chess__history_header'], 'History: ');
    this.insertChild(historyHeader);
    this.historyWrapper = new BaseComponent('div', ['chess__history_items'], '', this.node);
  }

  public setHistoryMove(coords: TurnInfo, time: string): void {
    if (deepEqual(this.lastTurn, coords)) {
      return;
    }
    this.lastTurn = coords;
    const { move, figure } = coords;
    const figureView = new FigureView(this.node, [
      `chess__figure`,
      `chess-field__${
        figure?.color === FigureColor.BLACK ? FigureColorLetter.BLACK : FigureColorLetter.WHITE
      }${figure?.type ?? ''}`,
    ]);
    const { comment } = coords;
    const historyItem = new BaseComponent(
      'div',
      ['chess__history_item'],
      '',
      this.historyWrapper.getNode(),
    );
    const moveText = new BaseComponent(
      'p',
      ['text'],
      `${boardCoordsY[move.from.y]}${boardCoordsX[move.from.x]}-${boardCoordsY[move.to.y]}${
        boardCoordsX[move.to.x]
      } ${time}`,
    );
    historyItem.insertChild(moveText);
    historyItem.insertChildBefore(figureView);
    if (comment) {
      const commentItem = new BaseComponent('div', ['chess__history_item'], comment);
      this.historyWrapper.insertChild(commentItem);
    }
  }
}
