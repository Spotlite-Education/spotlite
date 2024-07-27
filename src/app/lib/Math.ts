import { Vector2 } from './Curves';

// top left, bottom right
export type Box = [Vector2, Vector2];

export class MathUtil {
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static mod(x: number, n: number) {
    return ((x % n) + n) % n;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  static distance(p1: Vector2, p2: Vector2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  static quadraticRoots(a: number, b: number, c: number): number[] {
    const discriminant = b ** 2 - 4 * a * c;
    if (discriminant < 0) {
      return [];
    } else if (discriminant === 0) {
      return [-b / (2 * a)];
    } else {
      return [
        (-b + Math.sqrt(discriminant)) / (2 * a),
        (-b - Math.sqrt(discriminant)) / (2 * a),
      ];
    }
  }

  static isIntervalOverlapping = (a: [number, number], b: [number, number]) => {
    return a[0] <= b[1] && b[0] <= a[1];
  };

  static isBoxIntersecting(a: Box, b: Box): boolean {
    const xMin1 = a[0].x;
    const xMax1 = a[1].x;
    const yMin1 = a[1].y;
    const yMax1 = a[0].y;

    const xMin2 = b[0].x;
    const xMax2 = b[1].x;
    const yMin2 = b[1].y;
    const yMax2 = b[0].y;

    return xMin1 < xMax2 && xMin2 < xMax1 && yMin1 < yMax2 && yMin2 < yMax1;
  }
}
