import BaseComponent from '@components/base-component';
import Button from '@components/button/button';
import PlayerView from './player';

export default class PlayerContainer extends BaseComponent {
  private readonly player: PlayerView;

  private updateButton: Button;

  private readonly name: string;

  private image: BaseComponent;

  constructor(
    name: string,
    isUpdatable: boolean,
    private readonly onSubmit?: (name: string) => void,
  ) {
    super({ className: 'player-container' });
    this.name = name;
    this.player = new PlayerView(name);
    this.updateButton = new Button('Update', this.edit.bind(this), ['button_update']);
    this.image = new BaseComponent({ className: 'avatar', content: this.name[0].toUpperCase() });
    this.appendChildren([this.image, this.player]);
    if (isUpdatable) {
      this.append(this.updateButton);
    }
  }

  edit(): void {
    this.player.setUpdateMode();
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Submit', this.submit.bind(this), ['button_edit']);
    this.node.append(this.updateButton.getNode());
  }

  submit(): void {
    const updatedName = this.player.getValue();
    this.onSubmit?.(updatedName);
    this.player.setUpdateMode();
    this.image.destroy();
    this.image = new BaseComponent({ className: 'avatar', content: updatedName[0].toUpperCase() });
    this.prepend(this.image);
    this.player.setName(updatedName);
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Update', this.edit.bind(this), ['button_update']);
    this.node.append(this.updateButton.getNode());
  }

  getUserName(): string {
    return this.player.getName();
  }
}
