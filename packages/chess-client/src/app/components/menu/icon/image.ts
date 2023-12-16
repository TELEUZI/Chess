import BaseComponent from '../../base-component';

export default class CustomImage extends BaseComponent<'img'> {
  private readonly src: string;

  constructor(src: string, imageClass: string[] = []) {
    super({ tag: 'img', className: `icon ${imageClass.join(' ')}` });
    this.src = src;
    this.node.src = this.src;
  }
}
