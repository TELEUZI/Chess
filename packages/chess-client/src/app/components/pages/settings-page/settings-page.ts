import BaseComponent from '../../base-component';
import GameDifficultyOptions from '../../../enums/game-difficulty-options';
import type PageController from '../../../interfaces/page';
import Select from '../../select/select';
import ConfigDaoService from '../../../services/config-dao-service';

export default class SettingsPage implements PageController {
  private readonly root: HTMLElement;

  private readonly selectDifficulty: Select;

  private readonly selectWrapper: BaseComponent;

  private readonly model: ConfigDaoService = ConfigDaoService.getInstance();

  constructor(root: HTMLElement) {
    this.root = root;
    this.selectWrapper = new BaseComponent('div', ['settings-wrapper']);
    this.selectDifficulty = new Select('Choose Difficulty of AI', [
      GameDifficultyOptions.easy,
      GameDifficultyOptions.medium,
      GameDifficultyOptions.hard,
    ]);
    this.selectDifficulty.onChange = () => {
      this.onChangeHandler();
    };
    this.selectWrapper.insertChilds([this.selectDifficulty]);
  }

  async createPage(): Promise<void> {
    this.root.append(this.selectWrapper.getNode());
  }

  onChangeHandler(): void {
    const { easy, medium, hard } = GameDifficultyOptions;
    const arr = [easy, medium, hard];
    const selectValue = this.selectDifficulty.getSelectValue();
    this.model.setData(arr.find((option) => option === selectValue) || GameDifficultyOptions.easy);
  }
}
