import BaseComponent from '../../base-component';

export default class CustomImage extends BaseComponent {
  private readonly src: string;

  constructor(src: string, imageClass?: string[]) {
    super('img', ['icon', ...(imageClass ?? [])], '');
    this.src = src;
    (this.node as HTMLImageElement).src = this.src;
  }
}
