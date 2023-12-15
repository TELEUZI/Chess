import BaseComponent from '../../components/base-component';
import Button from '../../components/button/button';

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
    super({ className: 'modal-content' });
    const messageHead = new BaseComponent({ className: 'popup-header', content: config.header });
    const messageBody = new BaseComponent({ className: 'popup-body', content: config.text });
    const submitButton = new Button('OK', () => {
      this.onModalClick();
    });
    if (config.secondButtonText) {
      const declineButton = new Button(config.secondButtonText, () => {
        this.onDeclineClick();
      });
      this.append(declineButton);
    }

    this.appendChildren([messageHead, messageBody, submitButton]);
  }
}
export default ModalContent;
