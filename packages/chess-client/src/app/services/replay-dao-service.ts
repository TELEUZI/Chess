import type GameMode from '../enums/game-mode';
import type { TimedMoveMessage } from '../interfaces/move-message';
import type { GameResult } from '../interfaces/replay';
import type Replay from '../interfaces/replay';
import type { Player } from '../interfaces/response';
import ReplayDao from '../models/replay-dao';

const OBJECT_STORE_KEY = 'date';
const OBJECT_STORE_NAME = 'ReplaysStore';
export default class ReplayDaoService {
  private readonly dao: ReplayDao;

  private static instance: ReplayDaoService;

  private constructor() {
    this.dao = new ReplayDao(OBJECT_STORE_NAME, OBJECT_STORE_KEY, undefined);
  }

  public static getInstance(): ReplayDaoService {
    if (!ReplayDaoService.instance) {
      ReplayDaoService.instance = new ReplayDaoService();
    }
    return ReplayDaoService.instance;
  }

  createReplay(date: number, mode: GameMode, players: Player[]): void {
    const history: TimedMoveMessage[] = [];
    const result: GameResult = null;
    const moves = 0;
    this.dao.create({ date, mode, players, history, moves, result });
  }

  createReplayFromObject(replay: Replay): void {
    this.dao.create(replay);
  }

  setData(replay: Replay): void {
    this.dao.create(replay);
  }

  async setMove(move: TimedMoveMessage): Promise<void> {
    const last = await this.getLast();
    last.history.push(move);
    this.setData(last);
  }

  async getByDate(date: number): Promise<Replay> {
    return (await this.dao.findAll()).find((replay) => replay.date === date);
  }

  async getData(): Promise<Replay> {
    return this.dao.get();
  }

  async getLast(): Promise<Replay> {
    const usersArray: Replay[] = await this.dao.findAll();
    return usersArray[usersArray.length - 1];
  }

  async getAll(): Promise<Replay[]> {
    return this.dao.findAll();
  }

  async setNewMove(move: TimedMoveMessage): Promise<void> {
    const last = await this.getLast();
    last.history.push(move);
    last.moves += 1;
    this.setData(last);
  }
}
