import ClickElement from '../../interfaces/click-elem';
import BaseComponent from '../base-component';
import Link from '../link/link';

export default class PopUpWindow extends BaseComponent {
  onOkClick: () => void;

  okButton: ClickElement;

  constructor(popUpText: string) {
    super('div', [], popUpText);
    this.node.innerText = popUpText;
    this.okButton = new Link('ok', '#bestscore', this.okButtonHandler.bind(this));
    this.insertChild(this.okButton);
  }

  okButtonHandler = (): void => {
    this.node.innerText = '';
    this.okButton = new Link('ok', '#bestscore', this.okButtonHandler.bind(this));
    this.insertChild(this.okButton);
    this.onOkClick?.();
  };

  close(): void {
    this.toggleClass('hidden');
  }
}
