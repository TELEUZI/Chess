import type User from '../../../interfaces/user';
import toBase64 from '../../../utils/base64convertver';
import BaseComponent from '../../base-component';
import RegForm from '../../reg-form/reg-form';
import ModalWindow from './modal-window';

export default class RegFormModal extends BaseComponent {
  private readonly form: RegForm;

  private readonly modal: ModalWindow;

  constructor(private readonly onGetData: (user: User) => void) {
    super('div', ['reg-form']);
    this.form = new RegForm(['modal-content', 'signup__container']);
    this.modal = new ModalWindow(this.form);
    this.insertChild(this.modal);
    this.modal.getModalWrapper().addListener('click', () => {
      this.toggleModal();
    });
    this.form.onSubmit = this.getFormData.bind(this);
    this.toggleModal();
  }

  toggleModal(): void {
    this.toggleClass('hidden');
  }

  async getFormData(str: string[], avatar: File): Promise<void> {
    const avatarBase64 = await toBase64(avatar);
    const currentUser = {
      name: str[0],
      score: 0,
      avatar: avatarBase64,
    };
    this.onGetData(currentUser);
  }
}
