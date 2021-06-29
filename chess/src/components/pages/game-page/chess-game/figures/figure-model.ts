export default class FigureModel {
  protected type = '';

  private color: number;

  protected weight: number;

  constructor(color: number) {
    this.color = color;
  }

  getColor(): number {
    return this.color;
  }

  setColor(color: number): void {
    this.color = color;
  }

  getType(): string {
    return this.type;
  }

  getWeight(): number {
    return this.weight;
  }
}
