import { Vector2 } from './Curves';

export class Vector {
  static scale(v: Vector2, s: number) {
    return { x: v.x * s, y: v.y * s };
  }

  static add(v: Vector2, t: Vector2) {
    return { x: v.x + t.x, y: v.y + t.y };
  }

  static subtract(v: Vector2, t: Vector2) {
    return { x: v.x - t.x, y: v.y - t.y };
  }

  static dotProduct(v1: Vector2, v2: Vector2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static angleBetween(v1: Vector2, v2: Vector2) {
    return Math.acos(
      Vector.dotProduct(v1, v2) / (Vector.magnitude(v1) * Vector.magnitude(v2))
    );
  }

  static rotate(v: Vector2, radians: number) {
    return {
      x: v.x * Math.cos(radians) - v.y * Math.sin(radians),
      y: v.x * Math.sin(radians) + v.y * Math.cos(radians),
    };
  }

  static magnitude(v: Vector2) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v: Vector2) {
    return Vector.scale(v, 1 / Vector.magnitude(v));
  }
}
