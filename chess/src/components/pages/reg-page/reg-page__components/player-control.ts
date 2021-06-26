import BaseComponent from '../../../base-component';
import Button from '../../../button/button';
import PlayerView from './player';

export default class PlayerContainer extends BaseComponent {
  player: PlayerView;

  updateButton: Button;

  name: string;

  constructor(name: string) {
    super();
    this.name = name;
    this.player = new PlayerView(name);
    this.updateButton = new Button('Update', ['button_update'], this.edit.bind(this));
    this.insertChilds([this.player, this.updateButton]);
  }

  edit(): void {
    this.player.setUpdateMode();
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Submit', ['button_edit'], this.submit.bind(this));
    this.node.append(this.updateButton.getNode());
  }

  submit(): void {
    this.player.setUpdateMode();
    this.player.setName(this.player.userNameUpdate.getValue());
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Update', ['button_update'], this.edit.bind(this));
    this.node.append(this.updateButton.getNode());
  }
}
