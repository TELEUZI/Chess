import BaseComponent from '../../base-component';
import type RegForm from '../../reg-form/reg-form';
import ModalContent from './modal-content';

export default class ModalWindow extends BaseComponent {
  private readonly modalContent: ModalContent | RegForm;

  private readonly modalWrapper: BaseComponent;

  constructor(
    modalContent: ModalContent | RegForm,
    parentNode?: HTMLElement,
    private readonly onModalClick?: () => void,
    private readonly onDeclineClick?: () => void,
  ) {
    super('div', ['modal']);
    this.modalWrapper = new BaseComponent('div', ['grey-modal']);
    this.modalContent = modalContent;
    if (modalContent instanceof ModalContent)
      (this.modalContent as ModalContent).onModalClick = () => {
        this.toggleModal();
        this.onModalClick?.();
      };
    (this.modalContent as ModalContent).onDeclineClick = () => {
      this.toggleModal();
      this.onDeclineClick?.();
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
