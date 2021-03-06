import BaseComponent from '../../base-component';
import Button from '../../button/button';

export interface IModalPopup {
  header: string;
  text: string;
  buttonText: string;
  secondButtonText?: string;
}

class ModalContent extends BaseComponent {
  private modalMessage: BaseComponent;

  private messageHead: BaseComponent;

  private messageBody: BaseComponent;

  private submitButton: Button;

  onModalClick: () => void = () => {};

  onDeclineClick: () => void = () => {};

  declineButton: Button;

  constructor(config: IModalPopup) {
    super('div', ['modal-content'], '');
    this.messageHead = new BaseComponent('div', ['popup-header'], config.header, this.node);
    this.messageBody = new BaseComponent('div', ['popup-body'], config.text, this.node);
    this.submitButton = new Button('OK', () => {
      this.onModalClick();
    });
    if (config.secondButtonText) {
      this.declineButton = new Button(config.secondButtonText, () => {
        this.onDeclineClick();
      });
      this.insertChild(this.declineButton);
    }

    this.insertChilds([this.submitButton]);
  }
}
export default ModalContent;
