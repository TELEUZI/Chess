import { combineReducers } from 'redux';
import { INIT_FIELD_STATE } from '@chess/config';
import { FigureColor, GameMode } from '@chess/game-common';

import { createFieldFromStrings } from '@chess/game-engine';
import { createReducer } from '@reduxjs/toolkit';

import {
  changeName,
  makeMove,
  setCurrentUserColor,
  setGameMode,
  setUserColor,
  setWinner,
} from './action-creators';

const fieldReducer = createReducer(createFieldFromStrings(INIT_FIELD_STATE), (builder) => {
  builder.addCase(makeMove, (_, action) => {
    return action.payload;
  });
});

const playerReducer = createReducer(
  {
    playerOne: 'Player 1',
    playerTwo: 'Player 2',
  },
  (builder) => {
    builder.addCase(changeName, (_, action) => {
      return {
        playerOne: action.payload.playerOne,
        playerTwo: action.payload.playerTwo,
      };
    });
  },
);

const playerColorReducer = createReducer({ color: FigureColor.WHITE }, (builder) => {
  builder.addCase(setUserColor, (_, action) => {
    return {
      color: action.payload,
    };
  });
});

const winnerReducer = createReducer<{
  winnerColor: FigureColor | null;
}>({ winnerColor: FigureColor.WHITE }, (builder) => {
  builder.addCase(setWinner, (_, action) => {
    return {
      winnerColor: action.payload,
    };
  });
});

const currentPlayerColorReducer = createReducer<{
  currentUserColor: FigureColor;
}>({ currentUserColor: FigureColor.WHITE }, (builder) => {
  builder.addCase(setCurrentUserColor, (_, action) => {
    return {
      currentUserColor: action.payload,
    };
  });
});

const gameModeReducer = createReducer<{ currentGameMode: GameMode }>(
  { currentGameMode: GameMode.SINGLE },
  (builder) => {
    builder.addCase(setGameMode, (_, action) => {
      return {
        currentGameMode: action.payload,
      };
    });
  },
);

const replayStateReducer = createReducer<{ currentReplayDate: number }>(
  { currentReplayDate: 0 },
  (builder) => {
    builder.addCase(setGameMode, (_, action) => {
      return {
        currentReplayDate: action.payload,
      };
    });
  },
);

export const rootReducer = combineReducers({
  field: fieldReducer,
  players: playerReducer,
  user: playerColorReducer,
  currentPlayer: currentPlayerColorReducer,
  gameMode: gameModeReducer,
  replayDate: replayStateReducer,
  winner: winnerReducer,
});
