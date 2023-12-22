import { v4 as uuidv4 } from 'uuid';
import type { AxiosResponse } from 'axios';
import { AxiosError } from 'axios';
import type {
  PlayerAddResponse,
  RoomCreateResponse,
  FigureColor,
  DrawResult,
  WsMessage,
  MoveMessage,
  GameInfo,
  Room,
} from '@chess/game-common';
import { GameStatus, GameAction, GameMode } from '@chess/game-common';

import { SERVER_ENDPOINT, api, baseURL, wsProtocol } from '@chess/config';
import { storeService } from '@chess/game-engine';

export async function getFreeRoom(): Promise<[string, Room] | undefined> {
  const rooms = await api.get<Record<string, Room>>('/rooms/');
  return Object.entries(rooms.data).find(
    (room) => room[1].clients.size < 2 && room[1].game.gameStatus === GameStatus.waitingRoom,
  );
}
function serializeMessage<T>(action: GameAction, payload: T): string {
  try {
    return JSON.stringify({ action, payload });
  } catch (err) {
    console.error('Error serializing message:', err);
    return '';
  }
}

export class SocketService {
  public onMove?: (fieldState: string, currentColor: FigureColor, lastMove: MoveMessage) => void;

  public onStart?: () => void;

  public onPlayerLeave?: () => void;

  public onPlayerDrawResponse?: (result: boolean) => void;

  public onPlayerDrawSuggest?: () => void;

  public socket?: WebSocket;

  public roomName?: string;

  public sendSocketMessage(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(message);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('Socket is not open'));
      }
    });
  }

  public async createRoom(playerName: string): Promise<void> {
    this.roomName = uuidv4();
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
    const message = serializeMessage(GameAction.moveFigure, { fieldState, moveMessage });
    return this.sendSocketMessage(message);
  }

  public suggestDraw(): Promise<boolean> {
    const message = serializeMessage(GameAction.drawSuggest, {});
    return this.sendSocketMessage(message);
  }

  public answerDraw(response: DrawResult): Promise<boolean> {
    const message = serializeMessage(GameAction.drawResponse, { isDraw: response.isDraw });
    return this.sendSocketMessage(message);
  }

  public endGame(reason: string): Promise<boolean> {
    const message = serializeMessage(GameAction.disconnect, { gameEnd: true, reason });
    return this.sendSocketMessage(message);
  }

  private handleGameStart(payload: GameInfo): void {
    storeService.setGameMode(GameMode.MULTIPLAYER);
    window.location.hash = '#game';
    const [playerOne, playerTwo] = payload.players.map((player) => player.name);
    this.onStart?.();
    storeService.updateUserNames(playerOne, playerTwo);
    storeService.setCurrentUserColor(payload.currentPlayerColor);
  }

  private handleFigureMove(payload: GameInfo): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.onMove?.(payload.fieldState!, payload.currentPlayerColor, payload.lastMove!);
    storeService.setCurrentUserColor(payload.currentPlayerColor);
  }

  /**
   * Handles different types of game actions received from the WebSocket server.
   * @param event - The event object containing the received message from the WebSocket server.
   */
  private gameStateUpdater(event: MessageEvent<string>): void {
    try {
      const response: WsMessage = JSON.parse(event.data) as WsMessage;
      const { action } = response;

      switch (action) {
        case GameAction.startGame:
          this.handleGameStart(response.payload);
          break;
        case GameAction.moveFigure:
          this.handleFigureMove(response.payload);
          break;
        case GameAction.disconnect: {
          const winnerColor = response.payload.players[0].color;
          storeService.setWinner(winnerColor);
          this.onPlayerLeave?.();
          break;
        }
        case GameAction.drawSuggest:
          this.onPlayerDrawSuggest?.();
          break;
        case GameAction.setUserColor: {
          const userColor = response.payload.color;
          storeService.setUserColor(userColor);
          this.onStart?.();
          break;
        }
        case GameAction.drawResponse: {
          const isDraw = response.payload.isDraw || false;
          this.onPlayerDrawResponse?.(isDraw);
          break;
        }
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
