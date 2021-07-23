import FigureColor from '../../../../enums/figure-colors';
import BaseComponent from '../../../base-component';
import Figure from './cell/figure-view';
import { TurnInfo } from './field/field-model';

export const figures = new Map([
  ['p', 'Pawn'],
  ['l', 'Rook'],
  ['n', 'Knight'],
  ['e', 'Bishop'],
  ['q', 'Queen'],
  ['k', 'King'],
]);
export const boardCoordsY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const boardCoordsX = ['1', '2', '3', '4', '5', '6', '7', '8'].reverse();

export default class ChessHistory extends BaseComponent {
  private historyWrapper: BaseComponent;

  constructor(parentNode: HTMLElement) {
    super('div', ['chess__history'], '', parentNode);
    const historyHeader = new BaseComponent('h3', ['chess__history_header'], 'History: ');
    this.insertChild(historyHeader);
    this.historyWrapper = new BaseComponent('div', ['chess__history_items'], '', this.node);
  }

  setHistoryMove(coords: TurnInfo, time: string): void {
    const { move } = coords;
    const { figure } = coords;
    const fig = new Figure(this.node, [
      `chess__figure`,
      `chess-field__${figure.color === FigureColor.BLACK ? 'b' : 'w'}${figure.type}`,
    ]);
    const { comment } = coords;
    const historyItem = new BaseComponent(
      'div',
      ['chess_history_item'],
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
    historyItem.insertChildBefore(fig);
    if (comment) {
      const commentItem = new BaseComponent('div', ['chess_history_item'], comment);
      this.historyWrapper.insertChild(commentItem);
    }
  }
}
