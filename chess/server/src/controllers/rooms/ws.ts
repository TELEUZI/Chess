import WebSocket from 'ws';
import { Room, rooms } from '../../entities/room/room';
import broadcastToRoom from '../../services/room/broadcast-to-room';
import { PlayerTokenInfo } from '../../services/player/player-tokenify';
import { GameInfo, MoveMessage } from '../../entities/game/game-interfaces';
import isReadyWS from '../../utils/ws-alive-check';
import { GameAction } from '../../entities/game/game-enums';

export function disconnectFromGame(
  ws: WebSocket,
  token: PlayerTokenInfo,
  closeClient?: boolean,
): void {
  const room = rooms.get(token.roomName) as Room;
  let state: GameInfo;
  try {
    state = room.game.disconnectPlayer(token.playerName);
  } catch (error) {
    if (!isReadyWS(ws)) {
      ws.send(JSON.stringify({ error: error.message }));
    }
    return;
  }
  if (!room.clients.has(token.playerName)) {
    if (!isReadyWS(ws)) {
      ws.send(JSON.stringify({ error: 'Client connection could not be found.' }));
    }
    return;
  }

  if (closeClient) {
    const client = room.clients.get(token.playerName);
    client?.close();
  }
  room.clients.delete(token.playerName);
  if (room.clients.size > 0) {
    rooms.set(token.roomName, room);
    broadcastToRoom(token.roomName, { action: GameAction.disconnect, payload: state });
  }
  rooms.delete(token.roomName);
}

export function startGame(token: PlayerTokenInfo): void {
  const room = rooms.get(token.roomName);
  try {
    const result = room.game.start();
    rooms.set(token.roomName, room);
    room.clients.forEach((client, i) => {
      const players = room.game.getPlayers();
      console.log(players);
      players.forEach((player, j) => {
        if (i === j) {
          console.log(player, client, i, j);
          client.send(
            JSON.stringify({
              action: GameAction.setUserColor,
              payload: { color: player.color },
            }),
          );
        }
      });
    });
    broadcastToRoom(token.roomName, { action: GameAction.startGame, payload: result });
  } catch (error) {
    broadcastToRoom(token.roomName, { error: error.message });
  }
}

export function joinGame(ws: WebSocket, token: PlayerTokenInfo): void {
  const room = rooms.get(token.roomName);
  if (room.clients.has(token.playerName)) {
    ws.send(
      JSON.stringify({
        error: 'Client connection has already been established for this room.',
      }),
    );
    return;
  }
  ws.once('close', () => {
    disconnectFromGame(ws, token, false);
  });
  room.clients.set(token.playerName, ws);
  rooms.set(token.roomName, room);
  const state = room.game.getGameStatus();
  broadcastToRoom(token.roomName, { action: GameAction.joinRoom, payload: state });
  if (room.clients.size === 2) {
    startGame(token);
  }
}

export function setMove(
  ws: WebSocket,
  token: PlayerTokenInfo,
  message: string,
  moveMessage: MoveMessage,
): void {
  const room = rooms.get(token.roomName);
  try {
    const gameUpdate = room.game.move(message, moveMessage);
    broadcastToRoom(token.roomName, { action: GameAction.moveFigure, payload: gameUpdate });
  } catch (error) {
    ws.send(JSON.stringify({ error: error.message }));
  }
}

export function suggestDraw(token: PlayerTokenInfo): void {
  try {
    broadcastToRoom(
      token.roomName,
      { action: GameAction.drawSuggest, payload: { isDraw: null } },
      token.playerName,
    );
  } catch (error) {
    broadcastToRoom(token.roomName, { error: error.message });
  }
}
export function submitDraw(token: PlayerTokenInfo): void {
  try {
    broadcastToRoom(token.roomName, { action: GameAction.drawResponse, payload: { isDraw: true } });
  } catch (error) {
    broadcastToRoom(token.roomName, { error: error.message });
  }
}
export function declineDraw(token: PlayerTokenInfo): void {
  try {
    broadcastToRoom(
      token.roomName,
      { action: GameAction.drawResponse, payload: { isDraw: false } },
      token.playerName,
    );
  } catch (error) {
    broadcastToRoom(token.roomName, { error: error.message });
  }
}
