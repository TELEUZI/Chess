import BaseComponent from '../../base-component';

export default class ModalWindow extends BaseComponent {
  private modalContent: BaseComponent;

  onHeaderClick: () => void;

  private modalWrapper: BaseComponent;

  constructor(modalContent: BaseComponent, parentNode?: HTMLElement) {
    super('div', ['modal']);
    this.modalWrapper = new BaseComponent('div', ['grey-modal']);
    this.modalContent = modalContent;
    this.modalContent.addClass('modal-content');
    this.insertChild(this.modalContent);
    this.insertChild(this.modalWrapper);
    if (parentNode) {
      parentNode.appendChild(this.node);
    }
  }

  toggleModal(): void {
    this.toggleClass('hidden');
  }

  getModalWrapper(): BaseComponent {
    return this.modalWrapper;
  }
}
