import type { Replay } from '@chess/game-common';
import { IndexedDBStores } from '@chess/config';
import { ReplayDao } from '../models/replay-dao';

const OBJECT_STORE_KEY = 'date';
export class ReplayDaoService {
  private static instance: ReplayDaoService | null = null;

  private readonly dao: ReplayDao;

  private constructor() {
    this.dao = new ReplayDao(IndexedDBStores.REPLAY_STORE, OBJECT_STORE_KEY, undefined);
  }

  public static getInstance(): ReplayDaoService {
    if (!ReplayDaoService.instance) {
      ReplayDaoService.instance = new ReplayDaoService();
    }
    return ReplayDaoService.instance;
  }

  public createReplayFromObject(replay: Replay): Promise<void> {
    return this.dao.create(replay);
  }

  public async getByDate(date: number): Promise<Replay | undefined> {
    return (await this.dao.findAll()).find((replay) => replay.date === date);
  }

  public getAll(): Promise<Replay[]> {
    return this.dao.findAll();
  }
}
