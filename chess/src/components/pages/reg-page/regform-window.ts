import Form from '../../../interfaces/form';
import User from '../../../interfaces/user';
import toBase64 from '../../../shared/base64convertver';
import Validator from '../../../shared/validator';
import BaseComponent from '../../base-component';
import RegForm from '../../reg-form/reg-form';
import ModalWindow from './modal-window';

export default class RegFormModal extends BaseComponent {
  private form: Form<Validator>;

  private currentUser: User;

  private modal: ModalWindow;

  onGetData: (user: User) => void;

  onHeaderClick: () => void;

  constructor(onGetData: (user: User) => void) {
    super('div', ['reg-form']);
    this.form = new RegForm(['modalContent']);
    this.modal = new ModalWindow(this.form);
    this.insertChild(this.modal);
    this.modal.getModalWrapper().addListener('click', () => this.toggleModal());
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
      avatar: (await toBase64(avatar))?.toString(),
    };
    this.onGetData?.(this.currentUser);
  }
}
