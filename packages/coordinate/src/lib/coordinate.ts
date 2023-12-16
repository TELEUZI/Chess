export class Coordinate {
  public x: number;

  public y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  public equals(coordinate: Readonly<Coordinate | null>): boolean {
    return this.x === coordinate?.x && this.y === coordinate.y;
  }
}
