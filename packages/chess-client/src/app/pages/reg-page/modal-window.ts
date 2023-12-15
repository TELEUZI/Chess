import BaseComponent from '../../components/base-component';
import type RegForm from '../../components/reg-form/reg-form';
import ModalContent from './modal-content';

export default class ModalWindow extends BaseComponent {
  private readonly modalContent: ModalContent | RegForm;

  private readonly modalWrapper: BaseComponent;

  constructor(
    modalContent: ModalContent | RegForm,
    parentNode?: HTMLElement | null,
    private readonly onModalClick?: () => void,
    private readonly onDeclineClick?: () => void,
  ) {
    super({ className: 'modal' });
    this.modalWrapper = new BaseComponent({ className: 'grey-modal' });
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
    this.appendChildren([this.modalContent, this.modalWrapper]);
  }

  toggleModal(): void {
    this.toggleClass('hidden');
  }

  getModalWrapper(): BaseComponent {
    return this.modalWrapper;
  }
}
