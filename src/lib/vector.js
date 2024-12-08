export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static add(v1, v2) {
    const x = v1.x + v2.x;
    const y = v1.y + v2.y;

    return new Vector2(x, y);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  scale(t) {
    const x = this.x * t;
    const y = this.y * t;
    return new Vector2(x, y);
  }
  size() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  reverse() {
    const x = -this.x;
    const y = -this.y;
    return new Vector2(x, y);
  }
  normalize() {
    const x = v.x / v.size();
    const y = v.y / v.size();
    return new Vector2(x, y);
  }
}
