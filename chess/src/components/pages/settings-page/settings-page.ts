import BaseComponent from '../../base-component';
import GameDifficultyOptions from '../../../enums/game-difficulty-options';
import PageController from '../../../interfaces/page';
import Select from '../../select/select';
import ConfigDaoService from '../../../models/config-dao-service';

export default class SettingsPage implements PageController {
  private root: HTMLElement;

  private selectDifficulty: Select;

  private selectWrapper: BaseComponent;

  private model: ConfigDaoService = ConfigDaoService.getInstance();

  constructor(root: HTMLElement) {
    this.root = root;
    // TODO: give advance, startGame
    this.selectWrapper = new BaseComponent('div', ['settings-wrapper']);
    this.selectDifficulty = new Select('Choose Difficulty', [
      GameDifficultyOptions.easy,
      GameDifficultyOptions.medium,
      GameDifficultyOptions.hard,
    ]);
    this.selectDifficulty.onChange = () => this.onChangeHandler();
    this.selectWrapper.insertChilds([this.selectDifficulty]);
  }

  async createPage(): Promise<void> {
    this.root.appendChild(this.selectWrapper.getNode());
  }

  onChangeHandler(): void {
    this.model.setData(this.selectDifficulty.getSelectValue());
  }
}
