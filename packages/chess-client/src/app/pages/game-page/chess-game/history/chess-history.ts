import { h3 } from '@client/app/components/utils/h';
import { p } from '@client/app/components/utils/p';
import type { TurnInfo } from '@chess/game-common';
import { FigureColor } from '@chess/game-common';
import { FigureColorLetter } from '@chess/game-engine';

import BaseComponent from '@client/app/components/base-component';
import { FigureView } from '../views/figure-view';

export const boardCoordsY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const boardCoordsX = ['8', '7', '6', '5', '4', '3', '2', '1'];

function deepEqual<T>(object: T, value: T): boolean {
  return JSON.stringify(object) === JSON.stringify(value);
}

export class ChessHistory extends BaseComponent {
  public readonly historyWrapper: BaseComponent;

  public lastTurn: TurnInfo | null = null;

  constructor(parentNode: HTMLElement) {
    super({ className: 'chess__history', parent: parentNode });
    const historyHeader = h3('chess__history_header', 'History: ');
    this.append(historyHeader);
    this.historyWrapper = new BaseComponent({
      className: 'chess__history_wrapper',
      parent: this.node,
    });
  }

  public setHistoryMove(coords: TurnInfo, time: string): void {
    if (deepEqual(this.lastTurn, coords) || coords.figure == null) {
      return;
    }
    this.lastTurn = coords;
    const { move, figure } = coords;
    const figureView = new FigureView();
    figureView.classList.add(
      'chess__figure',
      `chess-field__${
        figure.color === FigureColor.BLACK ? FigureColorLetter.BLACK : FigureColorLetter.WHITE
      }${figure.type}`,
    );
    const { comment } = coords;
    const historyItem = new BaseComponent({
      className: 'chess__history_item',
      parent: this.historyWrapper.getNode(),
    });
    const moveText = p(
      'text',
      `${boardCoordsY[move.from.y]}${boardCoordsX[move.from.x]}-${boardCoordsY[move.to.y]}${
        boardCoordsX[move.to.x]
      } ${time}`,
    );
    historyItem.append(moveText);
    historyItem.prepend(figureView);
    if (comment != null) {
      const commentItem = new BaseComponent({
        className: 'chess__history_comment',
      });
      this.historyWrapper.append(commentItem);
    }
  }
}
