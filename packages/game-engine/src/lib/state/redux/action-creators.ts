import type { FigureColor, GameMode } from '@chess/game-common';
import { createAction } from '@reduxjs/toolkit';
import {
  CHANGE_USERNAME,
  SET_CURRENT_USER_COLOR,
  SET_GAME_MODE,
  SET_REPLAY_STATE,
  SET_USER_COLOR,
  SET_WINNER,
} from './types';

export const setUserColor = createAction<number>(SET_USER_COLOR);

export const setCurrentUserColor = createAction<number>(SET_CURRENT_USER_COLOR);

export const setGameMode = createAction<GameMode>(SET_GAME_MODE);

export const setReplayState = createAction<number>(SET_REPLAY_STATE);

export const changeName = createAction<{ playerOne: string; playerTwo: string }>(CHANGE_USERNAME);

export const setWinner = createAction<FigureColor | null>(SET_WINNER);
