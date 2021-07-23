export function getEmptyBoard(): string[][] {
  const board = [];
  for (let i = 0; i < 8; i += 1) {
    board[i] = [];
  }
  return board;
}

export function getBoardFromFen(fen: string): string[][] {
  const board: string[][] = getEmptyBoard();
  let rank = 0;
  let file = 0;
  let fenIndex = 0;
  let fenChar;
  let count;

  while (fenIndex < fen.length) {
    fenChar = fen[fenIndex];
    if (fenChar === ' ') {
      break;
    }
    if (fenChar === '/') {
      rank += 1;
      file = 0;
      fenIndex += 1;
      // eslint-disable-next-line no-continue
      continue;
    }
    if (Number.isNaN(parseInt(fenChar, 10))) {
      board[rank][file] = fenChar;
      file += 1;
    } else {
      count = parseInt(fenChar, 10);
      for (let i = 0; i < count; i += 1) {
        board[rank][file] = '';
        file += 1;
      }
    }
    fenIndex += 1;
  }
  return board;
}

export function getFenFromStringBoard(board: string[][]): string {
  const fen = [];
  for (let i = 0; i < 8; i += 1) {
    let empty = 0;
    for (let j = 0; j < 8; j += 1) {
      const piece = board[i][j];
      if (piece) {
        if (empty > 0) {
          fen.push(empty);
          empty = 0;
        }
        fen.push(piece);
      } else {
        empty += 1;
      }
    }
    if (empty > 0) {
      fen.push(empty);
    }
    fen.push('/');
  }
  fen.pop();
  return fen.join('');
}
