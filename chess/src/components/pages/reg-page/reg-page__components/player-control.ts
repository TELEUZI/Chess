import BaseComponent from '../../../base-component';
import Button from '../../../button/button';
import PlayerView from './player';
import BASE_LOGO from '../../../../assets/icons/ava.png';
import CustomImage from '../../../menu/icon/image';

export default class PlayerContainer extends BaseComponent {
  player: PlayerView;

  updateButton: Button;

  name: string;

  image: BaseComponent;

  onSubmit: (name: string) => void;

  constructor(name: string) {
    super('div', ['player-wrapper']);
    this.image = new CustomImage(BASE_LOGO, ['avatar']);
    this.name = name;
    this.player = new PlayerView(name);
    this.updateButton = new Button('Update', ['button_update'], this.edit.bind(this));
    this.insertChilds([this.image, this.player, this.updateButton]);
  }

  edit(): void {
    this.player.setUpdateMode();
    this.updateButton.getNode().remove();
    this.updateButton = new Button('Submit', ['button_edit'], this.submit.bind(this));
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
    this.updateButton = new Button('Update', ['button_update'], this.edit.bind(this));
    this.node.append(this.updateButton.getNode());
  }

  getUserName(): string {
    return this.player.getName();
  }
}
