export default class FigureModel {
  protected type = '';

  private color: number;

  constructor(color: number) {
    this.color = color;
  }

  getColor(): number {
    return this.color;
  }

  getType(): string {
    return this.type;
  }
}
