import { combineReducers } from 'redux';
import createFieldFromStrings from '../../utils/field-fabric';
import FieldState from '../field-state';

import { CHANGE_USERNAME, MOVE } from './types';

const initialField = [
  'rnbqkbnr',
  'pppppppp',
  '        ',
  '        ',
  '        ',
  '        ',
  'PPPPPPPP',
  'RNBQKBNR',
];

function fieldReducer(
  state: FieldState = createFieldFromStrings(initialField),
  action: { type: string; payload: FieldState },
) {
  switch (action.type) {
    case MOVE: {
      return action.payload;
    }
    default:
      return state;
  }
}
export function makeMove(
  array: FieldState,
): {
  type: string;
  payload: FieldState;
} {
  return {
    type: MOVE,
    payload: array,
  };
}

export const initialPlayerState = {
  playerOne: 'Player 1',
  playerTwo: 'Player 2',
};

function playerReducer(
  state = initialPlayerState,
  action: { type: string; payload: { playerOne: string; playerTwo: string } },
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
export function changeName(names: {
  playerOne: string;
  playerTwo: string;
}): {
  type: string;
  payload: { playerOne: string; playerTwo: string };
} {
  return {
    type: CHANGE_USERNAME,
    payload: names,
  };
}
const rootReducer = combineReducers({
  field: fieldReducer,
  players: playerReducer,
});
export default rootReducer;
