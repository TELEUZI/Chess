class Vector {
  public x: number;

  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  add(vector: Vector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  sub(vector: Vector): Vector {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }
}

export default Vector;
