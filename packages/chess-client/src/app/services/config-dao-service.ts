import GameDifficultyOptions from '../enums/game-difficulty-options';
import type GameConfig from '../interfaces/game-config';
import ConfigDao from '../models/config-dao';

const BASE_CONFIG = {
  GameDifficulty: GameDifficultyOptions.easy,
};
const OBJECT_STORE_KEY = 0;
const OBJECT_STORE_NAME = 'GameConfig';
export default class ConfigDaoService {
  private readonly dao: ConfigDao;

  private static instance: ConfigDaoService;

  private constructor() {
    this.dao = new ConfigDao(OBJECT_STORE_NAME, undefined, OBJECT_STORE_KEY);
    this.dao.create(BASE_CONFIG);
  }

  public static getInstance(): ConfigDaoService {
    if (!ConfigDaoService.instance) {
      ConfigDaoService.instance = new ConfigDaoService();
    }
    return ConfigDaoService.instance;
  }

  setData(gameDifficulty: GameDifficultyOptions): void {
    this.dao.create({ GameDifficulty: gameDifficulty });
  }

  async getData(): Promise<GameConfig> {
    return this.dao.get();
  }
}
