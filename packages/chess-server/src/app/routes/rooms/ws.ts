import type { ParsedQs } from 'qs';
import type WebSocket from 'ws';
import type { RoomsMessageData } from '@chess/game-common';
import { GameAction } from '@chess/game-common';
import type { PlayerTokenInfo } from '../../services/player/player-tokenify';
import { verifyDecodeToken } from '../../services/player/player-tokenify';
import { rooms } from '../../entities/room/room';
import {
  declineDraw,
  disconnectFromGame,
  joinGame,
  setMove,
  startGame,
  submitDraw,
  suggestDraw,
} from '../../controllers/rooms/ws';

function checkData(data: RoomsMessageData): void {
  if (data.action == null || !(data.action in GameAction)) {
    throw new Error('Data action must be defined and within acceptable values.');
  }
}

function handleSocketAction(ws: WebSocket, token: PlayerTokenInfo, data: RoomsMessageData): void {
  switch (data.action) {
    case GameAction.joinRoom:
      joinGame(ws, token);
      break;
    case GameAction.moveFigure: {
      if (data.payload == null) {
        throw new Error('Payload must be defined.');
      }
      setMove(ws, token, data.payload.fieldState, data.payload.moveMessage);
      break;
    }
    case GameAction.disconnect:
      disconnectFromGame(ws, token);
      break;
    case GameAction.startGame:
      startGame(token);
      break;
    case GameAction.drawSuggest:
      suggestDraw(token);
      break;
    case GameAction.drawResponse:
      if (data.payload?.isDraw === true) {
        submitDraw(token);
      } else {
        declineDraw(token);
      }
      break;
    default:
      ws.send(JSON.stringify({ error: 'Action could not be matched to a controller.' }));
  }
}
export default function buildRouting(ws: WebSocket, queryParams: ParsedQs): void {
  const { accessToken } = queryParams;
  if (typeof accessToken !== 'string') {
    ws.send(JSON.stringify({ error: 'Access token query param missing or invalid type.' }));
    return;
  }
  try {
    const token = verifyDecodeToken(accessToken);

    ws.on('message', (rawData) => {
      if (typeof rawData !== 'string') {
        ws.send(JSON.stringify({ error: 'Data should be a string type.' }));
        return;
      }
      const data = JSON.parse(rawData) as RoomsMessageData;
      try {
        checkData(data);
      } catch (error) {
        if (error instanceof Error) {
          ws.send(JSON.stringify({ error: error.message }));
        }
        return;
      }
      if (!rooms.has(token.roomName)) {
        ws.send(JSON.stringify({ error: 'Requested room does not exist.' }));
        return;
      }
      handleSocketAction(ws, token, data);
    });
  } catch (error) {
    if (error instanceof Error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  }
}
