export function getEmptyBoard(): string[][] {
  const board = [];
  for (let i = 0; i < 8; i += 1) {
    board[i] = [];
  }
  return board;
}

export function getBoardFromFen(fen: string): string[][] {
  const board: string[][] = getEmptyBoard();
  const rows = fen.split('/');
  if (rows.length !== 8) {
    throw new Error(`Invalid FEN code: '${fen}'`);
  }
  rows.forEach((row, index) => {
    let column = 0;
    let filled = 0;
    row.split('').forEach((char) => {
      if (/\d/.test(char)) {
        const empties = Number(char);
        for (let e = column; e < empties + column; e += 1) {
          board[index][e] = '';
          filled += 1;
        }
        column += empties;
      } else {
        board[index][column] = char;
        filled += 1;
        column += 1;
      }
    });
    if (filled !== 8) {
      throw new Error(`Invalid FEN code: '${fen}'`);
    }
  });
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
