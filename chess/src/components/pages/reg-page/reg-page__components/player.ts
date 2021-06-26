import BaseComponent from '../../../base-component';
import Input from '../../../input/input';

export default class PlayerView extends BaseComponent {
  name: string;

  userName: BaseComponent;

  userNameUpdate: Input;

  carName: BaseComponent;

  constructor(name: string) {
    super('div', ['user']);
    const userInfoWrapper = new BaseComponent('div', ['user__info']);
    this.name = name;
    this.userName = new BaseComponent('label', ['user__name'], name);
    this.userNameUpdate = new Input('text', ['user__name-input', 'hidden']);
    this.userNameUpdate.setValue(name);
    userInfoWrapper.insertChilds([this.userName, this.userNameUpdate]);
    this.insertChild(userInfoWrapper);
  }

  setName(name: string): void {
    this.name = name;
    this.userName.setContent(name);
  }

  getName(): string {
    return this.name;
  }

  setUpdateMode(): void {
    this.userName.toggleClass('hidden');
    this.userNameUpdate.toggleClass('hidden');
  }
}
