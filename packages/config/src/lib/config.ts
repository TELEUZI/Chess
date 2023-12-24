import axios from 'axios';

export enum IndexedDBStores {
  USERS = 'Users',
  GAME_CONFIG = 'GameConfig',
  REPLAY_STORE = 'ReplaysStore',
}
export const BLACK_ROW_INDEX = 0;
export const WHITE_ROW_INDEX = 7;
export const INIT_FIELD_STATE = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];
export const INDEXED_DB_VERSION = 1;
export const INDEXED_DB_NAME = 'Teleuzi';
export const TABLE_SIZE = 8;
export const BEST_VALUE_MOVE_FOR_BLACK = -9999;
export const TIMER_DELAY = 0;
export const SERVER_ENDPOINT = '/rooms/';
export const baseURL =
  process.env.NODE_ENV === 'production' ? window.location.host : 'localhost:5000';

export const httpProtocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

export const wsProtocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';

export const api = axios.create({
  baseURL: `${httpProtocol}://${baseURL}`,
});
