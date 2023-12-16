import BaseComponent from '../../components/base-component';
import GameDifficultyOptions from '../../enums/game-difficulty-options';
import type PageController from '../../interfaces/page';
import Select from '../../components/select/select';
import ConfigDaoService from '../../services/config-dao-service';

export default class SettingsPage implements PageController {
  private readonly root: HTMLElement;

  private readonly selectDifficulty: Select<GameDifficultyOptions>;

  private readonly selectWrapper: BaseComponent;

  private readonly model: ConfigDaoService = ConfigDaoService.getInstance();

  constructor(root: HTMLElement) {
    this.root = root;
    this.selectWrapper = new BaseComponent({ className: 'settings-wrapper' });
    this.selectDifficulty = new Select<GameDifficultyOptions>(
      'Choose Difficulty of AI',
      [GameDifficultyOptions.easy, GameDifficultyOptions.medium, GameDifficultyOptions.hard],
      () => {
        this.onChangeHandler();
      },
    );
    this.selectWrapper.appendChildren([this.selectDifficulty]);
  }

  public createPage(): void {
    this.root.append(this.selectWrapper.getNode());
  }

  private onChangeHandler(): void {
    const selectValue = this.selectDifficulty.getSelectValue();
    this.model.setData(
      [GameDifficultyOptions.easy, GameDifficultyOptions.medium, GameDifficultyOptions.hard].find(
        (option) => option === selectValue,
      ) ?? GameDifficultyOptions.easy,
    );
  }
}