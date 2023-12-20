import type Replay from '../interfaces/replay';
import ReplayDao from '../models/replay-dao';

const OBJECT_STORE_KEY = 'date';
const OBJECT_STORE_NAME = 'ReplaysStore';
export default class ReplayDaoService {
  private static instance: ReplayDaoService | null = null;

  private readonly dao: ReplayDao;

  private constructor() {
    this.dao = new ReplayDao(OBJECT_STORE_NAME, OBJECT_STORE_KEY, undefined);
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
