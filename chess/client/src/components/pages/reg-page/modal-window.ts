import BaseComponent from '../../base-component';
import Button from '../../button/button';
import RegForm from '../../reg-form/reg-form';
import ModalContent from './modal-content';

export default class ModalWindow extends BaseComponent {
  private modalContent: ModalContent | RegForm;

  private modalWrapper: BaseComponent;

  submitButton: Button;

  onModalClick: () => void = () => {};

  onDeclineClick: () => void = () => {};

  constructor(
    modalContent: ModalContent | RegForm,
    onModalClick?: () => void,
    parentNode?: HTMLElement,
    onDeclineClick: () => void = () => {},
  ) {
    super('div', ['modal']);
    this.onModalClick = onModalClick;
    this.onDeclineClick = onDeclineClick;
    this.modalWrapper = new BaseComponent('div', ['grey-modal']);
    this.modalContent = modalContent;
    if (modalContent instanceof ModalContent)
      (this.modalContent as ModalContent).onModalClick = () => {
        this.toggleModal();
        this.onModalClick();
      };
    (this.modalContent as ModalContent).onDeclineClick = () => {
      this.toggleModal();
      this.onDeclineClick();
    };
    if (parentNode) {
      parentNode.append(this.node);
    }
    this.insertChilds([this.modalContent, this.modalWrapper]);
  }

  toggleModal(): void {
    this.toggleClass('hidden');
  }

  getModalWrapper(): BaseComponent {
    return this.modalWrapper;
  }
}
