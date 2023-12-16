import BaseComponent from '../../../components/base-component';
import Input from '../../../components/input/input';

export default class PlayerView extends BaseComponent {
  private readonly userName: BaseComponent<'label'>;

  private readonly userNameUpdate: Input;

  constructor(private name: string) {
    super({ className: 'user' });
    const userInfoWrapper = new BaseComponent({ className: 'user__info' });
    this.userName = new BaseComponent({ tag: 'label', className: 'user__name', content: name });
    this.userNameUpdate = new Input('text', ['user__name-input', 'hidden']);
    this.userNameUpdate.setValue(name);
    userInfoWrapper.appendChildren([this.userName, this.userNameUpdate]);
    this.append(userInfoWrapper);
  }

  public setName(name: string): void {
    this.name = name;
    this.userName.setContent(name);
  }

  public getName(): string {
    return this.name;
  }

  public setUpdateMode(): void {
    this.userName.toggleClass('hidden');
    this.userNameUpdate.toggleClass('hidden');
  }

  public getValue(): string {
    return this.userNameUpdate.getValue();
  }
}
