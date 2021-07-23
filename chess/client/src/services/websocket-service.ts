import { AxiosResponse } from 'axios';
import {
  changeName,
  setCurrentUserColor,
  setUserColor,
  setWinner,
} from '../components/pages/game-page/chess-game/state/redux/action-creators';
import store from '../components/pages/game-page/chess-game/state/redux/store';
import { api, SERVER_ENDPOINT, wsProtocol, baseURL } from '../config';

import FigureColor from '../enums/figure-colors';
import GameMode from '../enums/game-mode';
import { GameStatus, GameAction } from '../enums/game-status-action';
import MoveMessage from '../interfaces/move-message';
import {
  Room,
  PlayerSerializable,
  GameMessage,
  GameInfo,
  ColorMessage,
  DrawResult,
  PlayerAddResponse,
  RoomCreateResponse,
} from '../interfaces/response';
import redirectToGameWithMode from '../utils/start-game-utils';

export async function getFreeRoom(): Promise<[string, Room]> {
  const rooms = await api.get(`/rooms/`);
  return (Object.entries(rooms.data) as [string, Room][]).find(
    async (room) => room[1].clients.size < 2 && room[1].game.gameStatus === GameStatus.waitingRoom,
  );
}

class SocketService {
  private socket: WebSocket;

  private roomName: string;

  private playerToken: string;

  private playerInfo: PlayerSerializable;

  onMove: (fieldState: string, currentColor: FigureColor, lastMove: MoveMessage) => void;

  onSetColor: (color: FigureColor) => void;

  onStart: () => void = () => {};

  onPlayerLeave: () => void;

  onPlayerDrawResponse: (result: boolean) => void;

  onPlayerDrawSuggest: () => void;

  async createRoom(playerName: string): Promise<void> {
    this.roomName = 't'.repeat(Math.floor(Math.random() * 14));
    let resp: AxiosResponse<RoomCreateResponse> | undefined;
    try {
      resp = await api.post(`${SERVER_ENDPOINT}${this.roomName}?creatorName=${playerName}`);
    } catch (error) {
      if (error.response != null) {
        console.error(error.message);
      } else if (error.request != null) {
        console.error(error.request);
      } else {
        console.error(error.message);
      }
      return;
    }

    const { playerToken, playerInfo } = resp.data.creator;
    this.playerToken = playerToken;
    this.playerInfo = playerInfo;
    this.socket = this.joinBuildWSClient(playerToken);
  }

  async joinRoom(room: string, playerName: string): Promise<void> {
    let resp: AxiosResponse<PlayerAddResponse> | undefined;
    try {
      resp = await api.put(`${SERVER_ENDPOINT}${room}/players?playerName=${playerName}`);
    } catch (error) {
      console.error(error.message);
    }
    const { playerToken, playerInfo } = resp.data;
    this.playerToken = playerToken;
    this.playerInfo = playerInfo;
    this.socket = this.joinBuildWSClient(playerToken);
  }

  handleGameStart(payload: GameInfo) {
    redirectToGameWithMode(GameMode.MULTIPLAYER);
    const [playerOne, playerTwo] = payload.players.map((player) => player.name);
    this.onStart();
    store.dispatch(changeName({ playerOne, playerTwo }));
    store.dispatch(setCurrentUserColor(payload.currentPlayerColor));
  }

  handleFigureMove(payload: GameInfo) {
    this.onMove(payload.fieldState, payload.currentPlayerColor, payload.lastMove);
    store.dispatch(setCurrentUserColor(payload.currentPlayerColor));
  }

  gameStateUpdater(event: MessageEvent): void {
    try {
      const response: GameMessage = JSON.parse(event.data);
      switch (response.action) {
        case GameAction.startGame:
          this.handleGameStart(response.payload as GameInfo);
          break;
        case GameAction.moveFigure:
          this.handleFigureMove(response.payload as GameInfo);
          break;
        case GameAction.disconnect:
          store.dispatch(setWinner((response.payload as GameInfo).players[0].color));
          this.onPlayerLeave();
          break;
        case GameAction.drawSuggest:
          this.onPlayerDrawSuggest();
          break;
        case GameAction.setUserColor:
          store.dispatch(setUserColor((response.payload as ColorMessage).color));
          this.onStart();
          break;
        case GameAction.drawResponse:
          this.onPlayerDrawResponse((response.payload as DrawResult).isDraw);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  move(fieldState: string, moveMessage: MoveMessage): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket.send(
          JSON.stringify({ action: GameAction.moveFigure, payload: { fieldState, moveMessage } }),
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  suggestDraw(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket.send(JSON.stringify({ action: GameAction.drawSuggest }));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  answerDraw(response: DrawResult): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket.send(
          JSON.stringify({ action: GameAction.drawResponse, payload: { isDraw: response.isDraw } }),
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  endGame(reason: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.socket.send(
          JSON.stringify({
            action: GameAction.disconnect,
            payload: { gameEnd: true, reason },
          }),
        );
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  joinBuildWSClient(playerToken: string): WebSocket {
    const ws = new WebSocket(`${wsProtocol}://${baseURL}/rooms?accessToken=${playerToken}`);
    let connected = false;
    ws.onopen = (): void => {
      ws.send(
        JSON.stringify({
          action: GameAction.joinRoom,
        }),
      );
    };
    ws.onmessage = (event: MessageEvent): void => {
      if (!connected && event.data === 'Connected.') {
        connected = true;
        return;
      }
      this.gameStateUpdater(event);
    };
    ws.onerror = (event: Event): void => {
      console.error('ws connection error', event);
    };
    return ws;
  }
}

export const socketService = new SocketService();

export async function addUserToGame(userName: string): Promise<void> {
  const freeRoom = await getFreeRoom();
  if (!freeRoom) {
    socketService.createRoom(userName);
  } else {
    socketService.joinRoom(freeRoom[0], userName);
  }
}
