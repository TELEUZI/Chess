import './button.scss';
import BaseComponent from '../base-component';

export default class Button extends BaseComponent {
  constructor(
    textContent: string,
    protected onClick: () => void = () => {},
    buttonClasses: string[] = [],
  ) {
    super('button', ['button', ...buttonClasses], textContent);
    this.node.onclick = (e: Event) => {
      e.preventDefault();
      this.onClick();
    };
  }

  public updateOnClick(onClick: () => void): void {
    this.onClick = onClick;
  }
}
