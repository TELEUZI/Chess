import BaseComponent from '../base-component';
import type RegForm from '../reg-form/reg-form';
import ModalContent from './modal-content';

export class ModalWindow extends BaseComponent {
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
    if (this.modalContent instanceof ModalContent) {
      this.modalContent.onModalClick = () => {
        this.toggleModal();
        this.onModalClick?.();
      };
      this.modalContent.onDeclineClick = () => {
        this.toggleModal();
        this.onDeclineClick?.();
      };
    }
    if (parentNode) {
      parentNode.append(this.node);
    }
    this.appendChildren([this.modalContent, this.modalWrapper]);
  }

  public getModalWrapper(): BaseComponent {
    return this.modalWrapper;
  }

  private toggleModal(): void {
    this.toggleClass('hidden');
  }
}
