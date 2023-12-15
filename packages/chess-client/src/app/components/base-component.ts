import './style.scss';
import './normalize.scss';

interface Component<K extends keyof HTMLElementTagNameMap, P extends keyof HTMLElementTagNameMap> {
  parent?: BaseComponent<P> | HTMLElement | null;
  tag?: K;
  className?: string;
  content?: string;
}

export default class BaseComponent<T extends keyof HTMLElementTagNameMap = 'div'> {
  protected node: HTMLElementTagNameMap[T];

  constructor({ parent, tag, className, content }: Component<T, 'div'>) {
    const node = document.createElement(tag ?? ('div' as T));
    node.className = className ?? '';
    node.textContent = content ?? '';
    if (parent) {
      parent.append(node);
    }
    this.node = node;
  }

  append(child: BaseComponent<keyof HTMLElementTagNameMap> | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  prepend(child: BaseComponent): void {
    this.node.prepend(child.getNode());
  }

  appendChildren(children: BaseComponent<keyof HTMLElementTagNameMap>[]): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  getNode(): HTMLElementTagNameMap[T] {
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
