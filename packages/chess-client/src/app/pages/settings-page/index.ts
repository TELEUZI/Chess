import type { PageController } from '@chess/game-common';
import { GameDifficultyOptions, gameDifficultyOptionsValues } from '@chess/game-common';
import { ConfigDaoService } from '@chess/dao';
import Select from '@components/select/select';
import BaseComponent from '@components/base-component';

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
      gameDifficultyOptionsValues,
      async () => {
        await this.onChangeHandler();
      },
    );
    this.selectWrapper.appendChildren([this.selectDifficulty]);
  }

  public createPage(): void {
    this.root.append(this.selectWrapper.getNode());
  }

  private async onChangeHandler(): Promise<void> {
    const selectValue = this.selectDifficulty.getSelectValue();
    await this.model.setData(
      gameDifficultyOptionsValues.find((option) => option === selectValue) ??
        GameDifficultyOptions.easy,
    );
  }
}
