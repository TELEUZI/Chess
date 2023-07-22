import { combineReducers } from 'redux';
import { INIT_FIELD_STATE } from '@client/app/config';
import type FigureColor from '@client/app/enums/figure-colors';
import GameMode from '@client/app/enums/game-mode';
import createFieldFromStrings from '../../fabrics/field-fabric';
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

function fieldReducer(
  state: FieldState = createFieldFromStrings(INIT_FIELD_STATE),
  action: { type: string; payload: FieldState } = {
    type: MOVE,
    payload: createFieldFromStrings(INIT_FIELD_STATE),
  },
) {
  switch (action.type) {
    case MOVE: {
      return action.payload;
    }
    default:
      return state;
  }
}

function playerReducer(
  state = {
    playerOne: 'Player 1',
    playerTwo: 'Player 2',
  },
  action: { type: string; payload: { playerOne: string; playerTwo: string } } = {
    type: CHANGE_USERNAME,
    payload: { playerOne: 'Player 1', playerTwo: 'Player 2' },
  },
) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return {
        ...state,
        playerOne: action.payload.playerOne,
        playerTwo: action.payload.playerTwo,
      };
    default:
      return state;
  }
}
function playerColorReducer(
  state = { color: 1 },
  action: { type: string; payload: { color: number } } = {
    type: SET_USER_COLOR,
    payload: { color: 1 },
  },
) {
  switch (action.type) {
    case SET_USER_COLOR:
      return {
        ...state,
        color: action.payload.color,
      };
    default:
      return state;
  }
}
function winnerReducer(
  state = { winnerColor: 1 },
  action: { type: string; payload: { winnerColor: FigureColor } } = {
    type: SET_WINNER,
    payload: { winnerColor: 1 },
  },
) {
  switch (action.type) {
    case SET_WINNER:
      return {
        ...state,
        winnerColor: action.payload.winnerColor,
      };
    default:
      return state;
  }
}
function currentPlayerColorReducer(
  state = { currentUserColor: 1 },
  action: { type: string; payload: { currentUserColor: number } } = {
    type: SET_CURRENT_USER_COLOR,
    payload: { currentUserColor: 1 },
  },
) {
  switch (action.type) {
    case SET_CURRENT_USER_COLOR:
      return {
        ...state,
        currentUserColor: action.payload.currentUserColor,
      };
    default:
      return state;
  }
}

function gameModeReducer(
  state = { currentGameMode: GameMode.SINGLE },
  action: { type: string; payload: { currentGameMode: GameMode } } = {
    type: SET_GAME_MODE,
    payload: { currentGameMode: GameMode.SINGLE },
  },
) {
  switch (action.type) {
    case SET_GAME_MODE:
      return {
        ...state,
        currentGameMode: action.payload.currentGameMode,
      };
    default:
      return state;
  }
}
function replayStateReducer(
  state = { currentReplayDate: 0 },
  action: { type: string; payload: { replayDate: number } } = {
    type: SET_REPLAY_STATE,
    payload: { replayDate: 0 },
  },
) {
  switch (action.type) {
    case SET_REPLAY_STATE:
      return {
        ...state,
        currentReplayDate: action.payload.replayDate,
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  field: fieldReducer,
  players: playerReducer,
  color: playerColorReducer,
  currentPlayer: currentPlayerColorReducer,
  gameMode: gameModeReducer,
  replayDate: replayStateReducer,
  winner: winnerReducer,
});
export default rootReducer;
