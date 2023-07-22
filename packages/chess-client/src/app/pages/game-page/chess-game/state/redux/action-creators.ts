import type FigureColor from '@client/app/enums/figure-colors';
import type GameMode from '@client/app/enums/game-mode';
import type FieldState from '../field-state';
import {
  CHANGE_USERNAME,
  MOVE,
  SET_CURRENT_USER_COLOR,
  SET_GAME_MODE,
  SET_REPLAY_STATE,
  SET_USER_COLOR,
  SET_WINNER,
} from './types';

export function setUserColor(color: number): {
  type: string;
  payload: { color: number };
} {
  return {
    type: SET_USER_COLOR,
    payload: { color },
  };
}

export function setCurrentUserColor(color: number): {
  type: string;
  payload: { currentUserColor: number };
} {
  return {
    type: SET_CURRENT_USER_COLOR,
    payload: { currentUserColor: color },
  };
}

export function setGameMode(currentGameMode: GameMode): {
  type: string;
  payload: { currentGameMode: GameMode };
} {
  return {
    type: SET_GAME_MODE,
    payload: { currentGameMode },
  };
}

export function setReplayState(replayDate: number): {
  type: string;
  payload: { replayDate: number };
} {
  return {
    type: SET_REPLAY_STATE,
    payload: { replayDate },
  };
}

export function makeMove(array: FieldState): {
  type: string;
  payload: FieldState;
} {
  return {
    type: MOVE,
    payload: array,
  };
}

export function changeName(names: { playerOne: string; playerTwo: string }): {
  type: string;
  payload: { playerOne: string; playerTwo: string };
} {
  return {
    type: CHANGE_USERNAME,
    payload: names,
  };
}

export function setWinner(winnerColor: FigureColor): {
  type: string;
  payload: { winnerColor: FigureColor };
} {
  return {
    type: SET_WINNER,
    payload: { winnerColor },
  };
}
