import type User from '../../../interfaces/user';
import toBase64 from '../../../utils/base64convertver';
import BaseComponent from '../../base-component';
import RegForm from '../../reg-form/reg-form';
import ModalWindow from './modal-window';

export default class RegFormModal extends BaseComponent {
  private readonly form: RegForm;

  private currentUser: User;

  private readonly modal: ModalWindow;

  onGetData: (user: User) => void;

  onHeaderClick: () => void;

  constructor(onGetData: (user: User) => void) {
    super('div', ['reg-form']);
    this.form = new RegForm(['modal-content', 'signup__container']);
    this.modal = new ModalWindow(this.form);
    this.insertChild(this.modal);
    this.modal.getModalWrapper().addListener('click', () => {
      this.toggleModal();
    });
    this.onGetData = onGetData;
    this.form.onSubmit = this.getFormData.bind(this);
    this.toggleModal();
  }

  toggleModal(): void {
    this.toggleClass('hidden');
  }

  async getFormData(str: string[], avatar: File): Promise<void> {
    this.currentUser = {
      name: str[0],
      score: 0,
      avatar: (await toBase64(avatar)).toString(),
    };
    this.onGetData(this.currentUser);
  }
}
