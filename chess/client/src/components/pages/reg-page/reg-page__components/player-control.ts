import BaseComponent from '../../../base-component';
import Button from '../../../button/button';
import PlayerView from './player';

export default class PlayerContainer extends BaseComponent {
  private player: PlayerView;

  private updateButton: Button;

  private name: string;

  private image: BaseComponent;

  onSubmit: (name: string) => void;

  constructor(name: string, isUpdatable: boolean) {
    super('div', ['player-wrapper']);
    this.name = name;
    this.player = new PlayerView(name);
    this.updateButton = new Button('Update', this.edit.bind(this), ['button_update']);
    this.image = new BaseComponent('div', ['avatar'], this.name[0].toUpperCase());
    this.insertChilds([this.image, this.player]);
    if (isUpdatable) {
      this.insertChild(this.updateButton);
    }
  }

  edit(): void {
    this.player.setUpdateMode();
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Submit', this.submit.bind(this), ['button_edit']);
    this.node.append(this.updateButton.getNode());
  }

  submit(): void {
    const updatedName = this.player.userNameUpdate.getValue();
    this.onSubmit(updatedName);
    this.player.setUpdateMode();
    this.image.destroy();
    this.image = new BaseComponent('div', ['avatar'], updatedName[0].toUpperCase());
    this.insertChildBefore(this.image);
    this.player.setName(updatedName);
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Update', this.edit.bind(this), ['button_update']);
    this.node.append(this.updateButton.getNode());
  }

  getUserName(): string {
    return this.player.getName();
  }

  setUserName(name: string): void {
    this.player.setName(name);
  }
}
