import './style.scss';
import './normalize.scss';

interface Component<K extends keyof HTMLElementTagNameMap, P extends keyof HTMLElementTagNameMap> {
  parent?: BaseComponent<P> | HTMLElement | null;
  tag?: K;
  className?: string;
  content?: string;
  children?: BaseComponent<keyof HTMLElementTagNameMap>[];
}

export default class BaseComponent<T extends keyof HTMLElementTagNameMap = 'div'> {
  protected node: HTMLElementTagNameMap[T];

  constructor({ parent, tag, className, content, children }: Component<T, 'div'>) {
    const node = document.createElement(tag ?? ('div' as T));
    node.className = className ?? '';
    node.textContent = content ?? '';
    this.node = node;
    if (parent) {
      parent.append(node);
    }
    if (children) {
      this.appendChildren(children);
    }
  }

  public append(child: BaseComponent<keyof HTMLElementTagNameMap> | HTMLElement): void {
    if (child instanceof BaseComponent) {
      this.node.append(child.getNode());
    } else {
      this.node.append(child);
    }
  }

  public prepend(child: BaseComponent): void {
    this.node.prepend(child.getNode());
  }

  public appendChildren(
    children: BaseComponent<keyof HTMLElementTagNameMap>[] | HTMLElement[],
  ): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  public getNode(): HTMLElementTagNameMap[T] {
    return this.node;
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public setContent(content: string): void {
    this.node.textContent = content;
  }

  public setInnerHTML(html: string): void {
    this.node.innerHTML = html;
  }

  public setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  public removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public setClasses(className: string): void {
    className.split(' ').forEach((name) => {
      this.addClass(name);
    });
  }

  public setClassname(className: string): void {
    this.node.className = className;
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public addListener(
    event: string,
    listener: (e?: Event) => void,
    options: AddEventListenerOptions | boolean = false,
  ): void {
    this.node.addEventListener(event, listener, options);
  }

  public destroy(): void {
    this.node.remove();
  }
}
