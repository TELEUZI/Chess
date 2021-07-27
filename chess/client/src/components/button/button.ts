import './button.scss';
import BaseComponent from '../base-component';

export default class Button extends BaseComponent {
  constructor(textContent: string, onClick: () => void = () => {}, buttonClasses?: string[]) {
    super('button', ['button', ...(buttonClasses || [])], textContent);
    this.node.onclick = onClick;
  }
}
