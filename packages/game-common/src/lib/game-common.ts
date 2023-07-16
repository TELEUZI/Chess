export enum GameAction {
  joinRoom = 'joinRoom',
  startGame = 'startGame',
  disconnect = 'disconnect',
  moveFigure = 'moveFigure',
  drawSuggest = 'drawSuggest',
  drawResponse = 'drawResponse',
  setUserColor = 'setUserColor',
}

export enum GameStatus {
  waitingRoom = 'waitingRoom',
  running = 'running',
  ended = 'ended',
}
