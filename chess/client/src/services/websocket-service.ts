import axios, { AxiosResponse } from 'axios';
import {
  changeName,
  setCurrentUserColor,
  setUserColor,
} from '../components/pages/game-page/chess-game/state/redux/reducer';
import store from '../components/pages/game-page/chess-game/state/redux/store';
import {
  GameAction,
  Room,
  GameStatus,
  GameMessage,
  PlayerSerializable,
  GameInfo,
  ColorMessage,
} from '../components/pages/reg-page/start-page-view';
import FigureColor from '../enums/figure-colors';
import GameMode from '../enums/game-mode';
import redirectToGameWithMode from '../shared/start-game-utils';

export const baseURL =
  process.env.NODE_ENV === 'production' ? 'teleuzi-chess.herokuapp.com' : 'localhost:5000';

const httpProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

export const wsProtocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';

export const api = axios.create({
  baseURL: `${httpProtocol}://${baseURL}`,
});

export async function getFreeRoom(): Promise<[string, Room]> {
  const rooms = await api.get(`/rooms/`);
  console.log(Object.entries(rooms.data) as [string, Room][]);
  return (Object.entries(rooms.data) as [string, Room][]).find(
    async (room) =>
      room[1].clients.size < 2 &&
      room[1].game.gameStatus !== GameStatus.ended &&
      room[1].game.gameStatus !== GameStatus.running,
  );
}
export interface PlayerAddResponse {
  playerInfo: PlayerSerializable;
  playerToken?: string;
}

export interface RoomCreateResponse {
  roomCreated: boolean;
  creator: PlayerAddResponse;
  failureReason?: string;
}
export default class SocketService {
  socket: WebSocket;

  roomName: string;

  playerToken: string;

  playerInfo: PlayerSerializable;

  onMove: (fieldState: string, currentColor: FigureColor) => void;

  onSetColor: (color: FigureColor) => void;

  async startGame(): Promise<void> {
    this.socket?.send(
      JSON.stringify({
        action: GameAction.startGame,
      }),
    );
  }

  async createRoom(playerName: string): Promise<void> {
    this.roomName = 't'.repeat(Math.floor(Math.random() * 14));
    let resp: AxiosResponse<RoomCreateResponse> | undefined;
    try {
      resp = await api.post(`/rooms/${this.roomName}?creatorName=${playerName}`);
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
    console.log('response', resp.data);
    this.socket = this.joinBuildWSClient(playerToken);
  }

  async joinRoom(room: string, playerName: string): Promise<void> {
    let resp: AxiosResponse<PlayerAddResponse> | undefined;
    try {
      resp = await api.put(`/rooms/${room}/players?playerName=${playerName}`);
    } catch (error) {
      console.error(error.message);
    }
    const { playerToken, playerInfo } = resp.data;
    this.playerToken = playerToken;
    this.playerInfo = playerInfo;
    this.socket = this.joinBuildWSClient(playerToken);
  }

  move(fieldState: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.socket.send(JSON.stringify({ action: GameAction.move, payload: { fieldState } }));
        resolve(true);
      } catch (err) {
        reject(err);
      }
    });
  }

  joinBuildWSClient(playerToken: string): WebSocket {
    const ws = new WebSocket(`${wsProtocol}://${baseURL}/rooms?accessToken=${playerToken}`);
    let connected = false;
    const updateCurrentGameState = (event: MessageEvent): void => {
      const response: GameMessage = JSON.parse(event.data);
      console.log(response.action);
      if (response.action === 'start') {
        console.log('startGames');
        redirectToGameWithMode(GameMode.MULTIPLAYER);
        const [playerOne, playerTwo] = (response.payload as GameInfo).players.map(
          (player) => player.name,
        );
        store.dispatch(changeName({ playerOne, playerTwo }));
        store.dispatch(setCurrentUserColor((response.payload as GameInfo).currentPlayerColor));
      }
      if (response.action === 'join') {
        console.log('Join successfully!');
      }
      if (response.action === 'move') {
        this.onMove(
          (response.payload as GameInfo).fieldState,
          (response.payload as GameInfo).currentPlayerColor,
        );
        store.dispatch(setCurrentUserColor((response.payload as GameInfo).currentPlayerColor));
      }
      if (response.action === 'setUserColor') {
        store.dispatch(setUserColor((response.payload as ColorMessage).color));
      }
    };
    ws.onopen = (): void => {
      console.log('open');
      ws.send(
        JSON.stringify({
          action: GameAction.join,
        }),
      );
    };
    ws.onmessage = (event: MessageEvent): void => {
      if (!connected && event.data === 'Connected.') {
        connected = true;
        // this.client = ws;
        return;
      }
      if (!connected) {
        return;
      }
      console.log(event.data);
      updateCurrentGameState(event);
    };
    ws.onclose = (event: CloseEvent): void => {};
    ws.onerror = (event: Event): void => {
      console.error('ws connection error', event);
    };
    return ws;
  }
}
export const socketService = new SocketService();
export async function addUserToGame(userName: string): Promise<void> {
  console.log('click');
  const freeRoom = await getFreeRoom();
  console.log(freeRoom);
  if (!freeRoom) {
    socketService.createRoom(userName);
  } else {
    socketService.joinRoom(freeRoom[0], userName);
  }
}
