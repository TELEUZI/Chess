import './style.scss';

export default class BaseComponent {
  protected node: HTMLElement;

  constructor(
    tagName: keyof HTMLElementTagNameMap = 'div',
    classNames: Array<string> = [],
    textContent = '',
  ) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.innerText = textContent;
  }

  insertChild(child: BaseComponent): void {
    this.node.appendChild(child.getNode());
  }

  insertChildBefore(child: BaseComponent): void {
    this.node.prepend(child.getNode());
  }

  insertChilds(child: BaseComponent[]): void {
    child.forEach((el) => {
      this.insertChild(el);
    });
  }

  getNode(): HTMLElement {
    return this.node;
  }

  addClass(className: string): void {
    this.node.classList.add(className);
  }

  setContent(content: string): void {
    this.node.innerText = content;
  }

  setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  setBgImage(image: string): void {
    this.node.style.backgroundImage = `url(${image})`;
  }

  addListener(
    event: string,
    listener: (e?: Event) => void,
    options: boolean | AddEventListenerOptions = false,
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  destroy(): void {
    this.node.remove();
  }
}
