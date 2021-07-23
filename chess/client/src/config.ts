import axios from 'axios';

export enum IndexedDBStores {
  USERS = 'Users',
  GAME_CONFIG = 'GameConfig',
  REPLAY_STORE = 'ReplaysStore',
}
export const BLACK_ROW_INDEX = 0;
export const WHITE_ROW_INDEX = 7;
export const INDEXED_DB_VERSION = 1;
export const INDEXED_DB_NAME = 'Teleuzi';
export const TABLE_SIZE = 8;
export const TIMER_DELAY = 0;
export const SERVER_ENDPOINT = `/rooms/`;
export const baseURL =
  process.env.NODE_ENV === 'production' ? 'teleuzi-chess.herokuapp.com' : 'localhost:5000';

export const httpProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

export const wsProtocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';

export const api = axios.create({
  baseURL: `${httpProtocol}://${baseURL}`,
});
