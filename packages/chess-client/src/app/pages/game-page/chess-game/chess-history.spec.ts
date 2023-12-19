import { FigureColor } from '@chess/game-common';
import FigureType from '@client/app/enums/figure-type';
import { Coordinate } from '@chess/coordinate';
import ChessHistory from './chess-history';

describe('setHistoryMove', () => {
  // Sets the lastTurn property to the given coords.
  it('should set the lastTurn property to the given coords', () => {
    const parentNode = document.createElement('div');
    const chessHistory = new ChessHistory(parentNode);
    const coords = {
      move: { from: new Coordinate(1, 2), to: new Coordinate(3, 4) },
      figure: { color: FigureColor.WHITE, type: FigureType.PAWN },
      comment: 'test',
    };
    const time = '12:00';

    chessHistory.setHistoryMove(coords, time);

    expect(chessHistory.lastTurn).toEqual(coords);
  });

  // Creates a new FigureView with the given figure and appends it to the history item.
  it('should create a new FigureView with the given figure and append it to the history item', () => {
    const parentNode = document.createElement('div');
    const chessHistory = new ChessHistory(parentNode);
    const coords = {
      move: { from: new Coordinate(1, 2), to: new Coordinate(3, 4) },
      figure: { color: FigureColor.WHITE, type: FigureType.PAWN },
      comment: 'test',
    };
    const time = '12:00';

    chessHistory.setHistoryMove(coords, time);

    const figureView = chessHistory.historyWrapper.getNode().querySelector('.chess__figure');
    expect(figureView).not.toBeNull();
  });

  // Creates a new history item and appends it to the history wrapper.
  it('should create a new history item and append it to the history wrapper', () => {
    const parentNode = document.createElement('div');
    const chessHistory = new ChessHistory(parentNode);
    const coords = {
      move: { from: new Coordinate(1, 2), to: new Coordinate(3, 4) },
      figure: { color: FigureColor.WHITE, type: FigureType.PAWN },
      comment: 'test',
    };
    const time = '12:00';

    chessHistory.setHistoryMove(coords, time);

    const historyItem = chessHistory.historyWrapper.getNode().querySelector('.chess__history_item');
    expect(historyItem).not.toBeNull();
  });

  // Does not create a new FigureView if the figure is null.
  it('should not create a new FigureView if the figure is null', () => {
    const parentNode = document.createElement('div');
    const chessHistory = new ChessHistory(parentNode);
    const coords = {
      move: { from: new Coordinate(1, 2), to: new Coordinate(3, 4) },
      figure: undefined,
      comment: 'test',
    };
    const time = '12:00';

    chessHistory.setHistoryMove(coords, time);

    const figureView = chessHistory.historyWrapper.getNode().querySelector('.chess__figure');
    expect(figureView).toBeNull();
  });
});
