import { combineReducers } from 'redux';
import { INIT_FIELD_STATE } from '@client/app/config';
import GameMode from '@client/app/enums/game-mode';
import { FigureColor } from '@chess/game-common';
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
): FieldState {
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
  action: { type: typeof CHANGE_USERNAME; payload: { playerOne: string; playerTwo: string } } = {
    type: CHANGE_USERNAME,
    payload: { playerOne: 'Player 1', playerTwo: 'Player 2' },
  },
): { playerOne: string; playerTwo: string } {
  switch (action.type) {
    case CHANGE_USERNAME:
      return {
        playerOne: action.payload.playerOne,
        playerTwo: action.payload.playerTwo,
      };
    default:
      return state;
  }
}
function playerColorReducer(
  state = { color: FigureColor.WHITE },
  action: { type: typeof SET_USER_COLOR; payload: { color: FigureColor } } = {
    type: SET_USER_COLOR,
    payload: { color: FigureColor.WHITE },
  },
): { color: FigureColor } {
  switch (action.type) {
    case SET_USER_COLOR:
      return {
        color: action.payload.color,
      };
    default:
      return state;
  }
}
function winnerReducer(
  state = { winnerColor: FigureColor.WHITE },
  action: { type: typeof SET_WINNER; payload: { winnerColor: FigureColor } } = {
    type: SET_WINNER,
    payload: { winnerColor: FigureColor.WHITE },
  },
): { winnerColor: FigureColor } {
  switch (action.type) {
    case SET_WINNER:
      return {
        winnerColor: action.payload.winnerColor,
      };
    default:
      return state;
  }
}
function currentPlayerColorReducer(
  state = { currentUserColor: FigureColor.WHITE },
  action: { type: typeof SET_CURRENT_USER_COLOR; payload: { currentUserColor: FigureColor } } = {
    type: SET_CURRENT_USER_COLOR,
    payload: { currentUserColor: FigureColor.WHITE },
  },
): { currentUserColor: FigureColor } {
  switch (action.type) {
    case SET_CURRENT_USER_COLOR:
      return {
        currentUserColor: action.payload.currentUserColor,
      };
    default:
      return state;
  }
}

function gameModeReducer(
  state = { currentGameMode: GameMode.SINGLE },
  action: { type: typeof SET_GAME_MODE; payload: { currentGameMode: GameMode } } = {
    type: SET_GAME_MODE,
    payload: { currentGameMode: GameMode.SINGLE },
  },
): { currentGameMode: GameMode } {
  switch (action.type) {
    case SET_GAME_MODE:
      return {
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
): { currentReplayDate: number } {
  switch (action.type) {
    case SET_REPLAY_STATE:
      return {
        currentReplayDate: action.payload.replayDate,
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  field: fieldReducer,
  players: playerReducer,
  user: playerColorReducer,
  currentPlayer: currentPlayerColorReducer,
  gameMode: gameModeReducer,
  replayDate: replayStateReducer,
  winner: winnerReducer,
});
export default rootReducer;
