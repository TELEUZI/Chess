import './style.scss';
import './normalize.scss';

export default class BaseComponent {
  protected node: HTMLElement;

  constructor(
    tagName: keyof HTMLElementTagNameMap = 'div',
    classNames: string[] = [],
    textContent = '',
    parentNode?: HTMLElement,
  ) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.textContent = textContent;
    if (parentNode) {
      parentNode.append(this.node);
    }
  }

  insertChild(child: BaseComponent): void {
    this.node.append(child.getNode());
  }

  insertChildBefore(child: BaseComponent): void {
    this.node.prepend(child.getNode());
  }

  insertChilds(childs: BaseComponent[]): void {
    childs.forEach((el) => {
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
    this.node.textContent = content;
  }

  setInnerHTML(html: string): void {
    this.node.innerHTML = html;
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

  setClasses(className: string): void {
    className.split(' ').forEach((name) => {
      this.addClass(name);
    });
  }

  setClassname(className: string): void {
    this.node.className = className;
  }

  removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  setBgImage(image: string): void {
    this.node.style.backgroundImage = `url(${image})`;
  }

  addListener(
    event: string,
    listener: (e?: Event) => void,
    options: AddEventListenerOptions | boolean = false,
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  destroy(): void {
    this.node.remove();
  }
}
