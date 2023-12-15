import './button.scss';
import BaseComponent from '../base-component';

export default class Button extends BaseComponent<'button'> {
  constructor(
    textContent: string,
    protected onClick: () => void = () => {},
    buttonClasses: string[] = [],
  ) {
    super({
      tag: 'button',
      className: 'button '.concat(buttonClasses.join(' ')),
      content: textContent,
    });
    this.node.onclick = (e: Event) => {
      e.preventDefault();
      this.onClick();
    };
  }
}
