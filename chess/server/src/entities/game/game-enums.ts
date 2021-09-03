export enum GameAction {
  joinRoom,
  startGame,
  disconnect,
  moveFigure,
  drawSuggest,
  drawResponse,
  setUserColor,
}

export enum GameStatus {
  waitingRoom,
  running,
  ended,
}
