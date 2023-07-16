import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import {
  changeName,
  setCurrentUserColor,
  setUserColor,
  setWinner,
} from '../components/pages/game-page/chess-game/state/redux/action-creators';
import store from '../components/pages/game-page/chess-game/state/redux/store';
import { api, SERVER_ENDPOINT, wsProtocol, baseURL } from '../config';

import type FigureColor from '../enums/figure-colors';
import GameMode from '../enums/game-mode';
import { GameStatus, GameAction } from '../enums/game-status-action';
import type MoveMessage from '../interfaces/move-message';
import type {
  Room,
  GameMessage,
  GameInfo,
  ColorMessage,
  DrawResult,
  PlayerAddResponse,
  RoomCreateResponse,
} from '../interfaces/response';
import redirectToGameWithMode from '../utils/start-game-utils';

export async function getFreeRoom(): Promise<[string, Room] | undefined> {
  const rooms = await api.get<Record<string, Room>>(`/rooms/`);
  return Object.entries(rooms.data).find(
    (room) => room[1].clients.size < 2 && room[1].game.gameStatus === GameStatus.waitingRoom,
  );
}

class SocketService {
  private socket?: WebSocket;

  private roomName?: string;

  onMove?: (fieldState: string, currentColor: FigureColor, lastMove: MoveMessage) => void;

  onStart?: () => void;

  onPlayerLeave?: () => void;

  onPlayerDrawResponse?: (result: boolean) => void;

  onPlayerDrawSuggest?: () => void;

  async createRoom(playerName: string): Promise<void> {
    this.roomName = 't'.repeat(Math.floor(Math.random() * 14));
    let resp: AxiosResponse<RoomCreateResponse> | null = null;
    try {
      resp = await api.post(`${SERVER_ENDPOINT}${this.roomName}?creatorName=${playerName}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response != null) {
          console.error(error.message);
        } else if (error.request != null) {
          console.error(error.request);
        } else {
          console.error(error.message);
        }
      }
      return;
    }
    if (resp == null) {
      return;
    }
    const { playerToken, playerInfo } = resp.data.creator;
    console.log(playerInfo);
    this.socket = this.joinBuildWSClient(playerToken ?? '');
  }

  async joinRoom(room: string, playerName: string): Promise<void> {
    let resp: AxiosResponse<PlayerAddResponse> | null = null;
    try {
      resp = await api.put(`${SERVER_ENDPOINT}${room}/players?playerName=${playerName}`);
    } catch (error) {
      console.error(error.message);
    }
    if (resp == null) {
      return;
    }
    const { playerToken, playerInfo } = resp.data;
    console.log(playerInfo);
    this.socket = this.joinBuildWSClient(playerToken ?? '');
  }

  handleGameStart(payload: GameInfo) {
    redirectToGameWithMode(GameMode.MULTIPLAYER);
    const [playerOne, playerTwo] = payload.players.map((player) => player.name);
    this.onStart?.();
    store.dispatch(changeName({ playerOne, playerTwo }));
    store.dispatch(setCurrentUserColor(payload.currentPlayerColor));
  }

  handleFigureMove(payload: GameInfo) {
    this.onMove?.(payload.fieldState, payload.currentPlayerColor, payload.lastMove);
    store.dispatch(setCurrentUserColor(payload.currentPlayerColor));
  }

  gameStateUpdater(event: MessageEvent<string>): void {
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
          this.onPlayerLeave?.();
          break;
        case GameAction.drawSuggest:
          this.onPlayerDrawSuggest?.();
          break;
        case GameAction.setUserColor:
          store.dispatch(setUserColor((response.payload as ColorMessage).color));
          this.onStart?.();
          break;
        case GameAction.drawResponse:
          this.onPlayerDrawResponse?.((response.payload as DrawResult).isDraw);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  async move(fieldState: string, moveMessage: MoveMessage): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket?.send(
          JSON.stringify({ action: GameAction.moveFigure, payload: { fieldState, moveMessage } }),
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async suggestDraw(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket?.send(JSON.stringify({ action: GameAction.drawSuggest }));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async answerDraw(response: DrawResult): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket?.send(
          JSON.stringify({ action: GameAction.drawResponse, payload: { isDraw: response.isDraw } }),
        );
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  async endGame(reason: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.socket?.send(
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
    ws.onmessage = (event: MessageEvent<string>): void => {
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
    await socketService.createRoom(userName);
  } else {
    await socketService.joinRoom(freeRoom[0], userName);
  }
}
