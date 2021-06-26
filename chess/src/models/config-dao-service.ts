import ConfigDao from '../dao/config-dao';
import GameDifficultyOptions from '../enums/game-difficulty-options';
import ImageCategoryOptions from '../enums/image-category-options';
import GameConfig from '../interfaces/game-config';

const BASE_CONFIG = {
  ImageCategory: ImageCategoryOptions.animals,
  GameDifficulty: GameDifficultyOptions.easy,
};
const OBJECT_STORE_KEY = 0;
const OBJECT_STORE_NAME = 'GameConfig';
export default class ConfigDaoService {
  private dao: ConfigDao;

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

  setData(imageCategory: string, gameDifficulty: string): void {
    this.dao.create({ ImageCategory: imageCategory, GameDifficulty: gameDifficulty });
  }

  getData(): Promise<GameConfig> {
    return this.dao.get();
  }
}
