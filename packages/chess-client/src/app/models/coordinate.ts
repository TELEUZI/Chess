class Coordinate {
  x: number;

  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }

  equals(coordinate: Coordinate): boolean {
    return this.x === coordinate.x && this.y === coordinate.y;
  }
}

export default Coordinate;
