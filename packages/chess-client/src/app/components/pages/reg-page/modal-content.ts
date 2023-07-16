import BaseComponent from '../../base-component';
import Button from '../../button/button';

export interface IModalPopup {
  header: string;
  text: string;
  buttonText: string;
  secondButtonText?: string;
}

class ModalContent extends BaseComponent {
  constructor(
    config: IModalPopup,
    public onModalClick: () => void = () => {},
    public onDeclineClick: () => void = () => {},
  ) {
    super('div', ['modal-content'], '');
    const messageHead = new BaseComponent('div', ['popup-header'], config.header);
    const messageBody = new BaseComponent('div', ['popup-body'], config.text);
    const submitButton = new Button('OK', () => {
      this.onModalClick();
    });
    if (config.secondButtonText) {
      const declineButton = new Button(config.secondButtonText, () => {
        this.onDeclineClick();
      });
      this.insertChild(declineButton);
    }

    this.insertChilds([messageHead, messageBody, submitButton]);
  }
}
export default ModalContent;
