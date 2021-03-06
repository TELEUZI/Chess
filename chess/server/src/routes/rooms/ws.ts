import { ParsedQs } from 'qs';
import WebSocket from 'ws';
import { PlayerTokenInfo, verifyDecodeToken } from '../../services/player/player-tokenify';
import { rooms } from '../../entities/room/room';
import { GameAction } from '../../entities/game/game-enums';
import {
  declineDraw,
  disconnectFromGame,
  joinGame,
  setMove,
  startGame,
  submitDraw,
  suggestDraw,
} from '../../controllers/rooms/ws';
import { RoomsMessageData } from '../../entities/message/message-interfaces';

export default function buildRouting(ws: WebSocket, queryParams: ParsedQs): void {
  const { accessToken } = queryParams;
  if (typeof accessToken !== 'string') {
    ws.send(JSON.stringify({ error: 'Access token query param missing or invalid type.' }));
    return;
  }
  let token: PlayerTokenInfo;
  try {
    token = verifyDecodeToken(accessToken);
    if (token === null) {
      throw new Error('Token decoded was null.');
    }
  } catch (error) {
    ws.send(JSON.stringify({ error: error.message }));
    return;
  }
  ws.on('message', (rawData) => {
    if (typeof rawData !== 'string') {
      ws.send(JSON.stringify({ error: 'Data should be a string type.' }));
      return;
    }
    const data = JSON.parse(rawData) as RoomsMessageData;
    try {
      checkData(data);
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
      return;
    }
    if (!rooms.has(token.roomName)) {
      ws.send(JSON.stringify({ error: 'Requested room does not exist.' }));
      return;
    }
    handleSocketAction(ws, token, data);
  });
}

function handleSocketAction(ws: WebSocket, token: PlayerTokenInfo, data: RoomsMessageData) {
  switch (data.action) {
    case GameAction.joinRoom:
      joinGame(ws, token);
      break;
    case GameAction.moveFigure:
      setMove(ws, token, data.payload.fieldState, data.payload.moveMessage);
      break;
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
      if (data.payload.isDraw) {
        submitDraw(token);
      } else {
        declineDraw(token);
      }
      break;
    default:
      ws.send(JSON.stringify({ error: 'Action could not be matched to a controller.' }));
  }
}

function checkData(data: RoomsMessageData): void {
  if (data.action == null || !(data.action in GameAction)) {
    throw new Error('Data action must be defined and within acceptable values.');
  }
}
