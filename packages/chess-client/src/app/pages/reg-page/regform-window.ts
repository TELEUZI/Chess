import { ModalWindow } from '@components/modal';
import BaseComponent from '@components/base-component';
import RegForm from '@components/reg-form/reg-form';
import type User from '../../interfaces/user';
import toBase64 from '../../utils/base64convertver';

export default class RegFormModal extends BaseComponent {
  private readonly form: RegForm;

  private readonly modal: ModalWindow;

  constructor(private readonly onGetData: (user: User) => void) {
    super({ className: 'reg-form' });
    this.form = new RegForm(['modal-content', 'signup__container'], this.getFormData.bind(this));
    this.modal = new ModalWindow(this.form);
    this.append(this.modal);
    this.modal.getModalWrapper().addListener('click', () => {
      this.toggleModal();
    });
    this.toggleModal();
  }

  public toggleModal(): void {
    this.toggleClass('hidden');
  }

  private async getFormData(str: string[], avatar: File | null): Promise<void> {
    const avatarBase64 = await toBase64(avatar);
    const currentUser = {
      name: str[0],
      score: 0,
      avatar: avatarBase64 ?? '',
    };
    this.onGetData(currentUser);
  }
}
