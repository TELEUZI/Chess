import type { GameConfig } from '@chess/game-common';
import { GameDifficultyOptions } from '@chess/game-common';
import { ConfigDao } from '../models/config-dao';

const BASE_CONFIG = {
  GameDifficulty: GameDifficultyOptions.easy,
};
const OBJECT_STORE_KEY = 0;
const OBJECT_STORE_NAME = 'GameConfig';
export class ConfigDaoService {
  private static instance: ConfigDaoService | null = null;

  private readonly dao: ConfigDao;

  private constructor() {
    this.dao = new ConfigDao(OBJECT_STORE_NAME, undefined, OBJECT_STORE_KEY);
    void this.dao.create(BASE_CONFIG);
  }

  public static getInstance(): ConfigDaoService {
    if (!ConfigDaoService.instance) {
      ConfigDaoService.instance = new ConfigDaoService();
    }
    return ConfigDaoService.instance;
  }

  public setData(gameDifficulty: GameDifficultyOptions): Promise<void> {
    return this.dao.create({ GameDifficulty: gameDifficulty });
  }

  public getData(): Promise<GameConfig> {
    return this.dao.get();
  }
}
