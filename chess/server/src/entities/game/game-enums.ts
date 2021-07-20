export enum GameAction {
  join,
  disconnect,
  move,
  startGame,
  getGameStatus,
}

export enum GameStatus {
  waitingRoom,
  running,
  ended,
}
