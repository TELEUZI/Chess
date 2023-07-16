import BaseComponent from '../../base-component';

export default class CustomImage extends BaseComponent {
  private src: string;

  constructor(src: string, imageClass?: string[]) {
    super('img', ['icon', ...(imageClass ?? [])], '');
    this.src = src;
    (this.node as HTMLImageElement).src = this.src;
  }

  setSrc(src: string): void {
    this.src = src;
    (this.node as HTMLImageElement).src = src;
  }

  getSrc(): string {
    return this.src;
  }
}
