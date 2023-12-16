import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import type {
  PlayerAddResponse,
  RoomCreateResponse,
  FigureColor,
  ColorMessage,
  DrawResult,
  WsMessage,
} from '@chess/game-common';
import { GameStatus, GameAction } from '@chess/game-common';
import { storeService } from '@client/app/pages/game-page/chess-game/state/store-service';

import { api, SERVER_ENDPOINT, wsProtocol, baseURL } from '../config';

import GameMode from '../enums/game-mode';
import type MoveMessage from '../interfaces/move-message';
import type { GameInfo, Room } from '../interfaces/response';
import redirectToGameWithMode from '../utils/start-game-utils';

export async function getFreeRoom(): Promise<[string, Room] | undefined> {
  const rooms = await api.get<Record<string, Room>>('/rooms/');
  return Object.entries(rooms.data).find(
    (room) => room[1].clients.size < 2 && room[1].game.gameStatus === GameStatus.waitingRoom,
  );
}

class SocketService {
  public onMove?: (fieldState: string, currentColor: FigureColor, lastMove: MoveMessage) => void;

  public onStart?: () => void;

  public onPlayerLeave?: () => void;

  public onPlayerDrawResponse?: (result: boolean) => void;

  public onPlayerDrawSuggest?: () => void;

  private socket?: WebSocket;

  private roomName?: string;

  public async createRoom(playerName: string): Promise<void> {
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
    const { playerToken } = resp.data.creator;
    this.socket = this.joinBuildWSClient(playerToken ?? '');
  }

  public async joinRoom(room: string, playerName: string): Promise<void> {
    let resp: AxiosResponse<PlayerAddResponse> | null = null;
    try {
      resp = await api.put(`${SERVER_ENDPOINT}${room}/players?playerName=${playerName}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    if (resp == null) {
      return;
    }
    const { playerToken } = resp.data;
    this.socket = this.joinBuildWSClient(playerToken ?? '');
  }

  public move(fieldState: string, moveMessage: MoveMessage): Promise<boolean> {
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

  public suggestDraw(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket?.send(JSON.stringify({ action: GameAction.drawSuggest }));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  public answerDraw(response: DrawResult): Promise<boolean> {
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

  public endGame(reason: string): Promise<void> {
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

  private handleGameStart(payload: GameInfo): void {
    redirectToGameWithMode(GameMode.MULTIPLAYER);
    const [playerOne, playerTwo] = payload.players.map((player) => player.name);
    this.onStart?.();
    storeService.updateUserNames(playerOne, playerTwo);
    storeService.setCurrentUserColor(payload.currentPlayerColor);
  }

  private handleFigureMove(payload: GameInfo): void {
    this.onMove?.(payload.fieldState, payload.currentPlayerColor, payload.lastMove);
    storeService.setCurrentUserColor(payload.currentPlayerColor);
  }

  private gameStateUpdater(event: MessageEvent<string>): void {
    try {
      const response: WsMessage = JSON.parse(event.data) as WsMessage;
      switch (response.action) {
        case GameAction.startGame:
          this.handleGameStart(response.payload as unknown as GameInfo);
          break;
        case GameAction.moveFigure:
          this.handleFigureMove(response.payload as unknown as GameInfo);
          break;
        case GameAction.disconnect:
          storeService.setWinner((response.payload as unknown as GameInfo).players[0].color);
          this.onPlayerLeave?.();
          break;
        case GameAction.drawSuggest:
          this.onPlayerDrawSuggest?.();
          break;
        case GameAction.setUserColor:
          storeService.setUserColor((response.payload as ColorMessage).color);
          this.onStart?.();
          break;
        case GameAction.drawResponse:
          this.onPlayerDrawResponse?.((response.payload as DrawResult).isDraw || false);
          break;
        default:
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      console.error(error);
    }
  }

  private joinBuildWSClient(playerToken: string): WebSocket {
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
