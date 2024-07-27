import { MathUtil } from './Math';
import { Vector } from './Vector';

export type Vector2 = {
  x: number;
  y: number;
};

export type Transform = {
  translate?: Vector2;
  scale?: number;
  centerPoint?: Vector2;
};

// top left, bottom right
export type BoundingBox = [Vector2, Vector2];

export type Stroke = {
  points: Vector2[];
  color: string;
};

const pointInvalid = (point: Vector2) => {
  return isNaN(point.x) || isNaN(point.y);
};

const pointToLineDistance = (
  point: Vector2,
  line: [Vector2, Vector2]
): number => {
  const a = 1;
  const b = (line[1].x - line[0].x) / (line[1].y - line[0].y);
  const c = line[0].y - b * line[0].x;

  return Math.abs(a * point.x + b * point.y + c) / Math.sqrt(a * a + b * b);
};

// simplifies a line using the Ramer-Douglas-Peucker algorithm
export const simplifyLine = (
  points: Vector2[],
  epsilon: number = 0.1
): Vector2[] => {
  if (points.length <= 2) {
    return points;
  }

  let maxDistance = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance = pointToLineDistance(points[i], [
      points[0],
      points[points.length - 1],
    ]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  if (maxDistance > epsilon) {
    const results1 = simplifyLine(points.slice(0, index), epsilon);
    const results2 = simplifyLine(points.slice(index), epsilon);
    const uniquePoints = new Set([...results1, ...results2]);
    return Array.from(uniquePoints);
  } else {
    return [points[0], points[points.length - 1]];
  }
};

type Quadruple<T> = [T, T, T, T];

export class Curve {
  id: string;
  name: string;

  constructor() {
    this.id = window.crypto.randomUUID();
    this.name = 'Path';
  }

  static simplify(
    points: Vector2[],
    decimationFactor: number = 3,
    epsilon: number = 0.08
  ): Vector2[] {
    const maxDist = points.reduce(
      (max, point, i) =>
        i === 0 ? max : Math.max(max, MathUtil.distance(point, points[i - 1])),
      0
    );

    points = [
      points[0],
      ...points
        .slice(1, points.length - 1)
        .filter(
          (point, i) => MathUtil.distance(point, points[i]) > epsilon * maxDist
        ),
      points[points.length - 1],
    ];

    // decimate points
    if (points.length >= 10) {
      points = points.filter((_, i) => {
        if (i === 0 || i === points.length - 1) {
          return true;
        }

        return i % decimationFactor === 0;
      });
    }

    return points;
  }
}

export class CatmullRomSpline {
  p0: Vector2;
  p1: Vector2;
  p2: Vector2;
  p3: Vector2;
  t0: number;
  t1: number;
  t2: number;
  t3: number;

  constructor(
    [p0, p1, p2, p3]: Quadruple<Vector2>,
    [t0, t1, t2, t3]: Quadruple<number>
  ) {
    this.p0 = p0;
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.t0 = t0;
    this.t1 = t1;
    this.t2 = t2;
    this.t3 = t3;
  }
}

export class CatmullRomCurve extends Curve {
  static SPLINE_FIDELITY = 50;

  points: Vector2[];
  alpha: number;
  splines: CatmullRomSpline[];

  constructor(points: Vector2[], alpha: number = 0.5) {
    super();
    this.points = points;
    this.alpha = alpha;
    this.splines = this._calculateCurve();
  }

  static _calculateKnot(
    tBefore: number,
    pointBefore: Vector2,
    pointCurrent: Vector2,
    alpha: number
  ) {
    const dx = pointCurrent.x - pointBefore.x;
    const dy = pointCurrent.y - pointBefore.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return Math.pow(dist, alpha) + tBefore;
  }

  static _calculateA = (
    t: number[],
    tBefore: number,
    tAfter: number,
    pointBefore: Vector2,
    pointAfter: Vector2
  ) => {
    const deltaT = tAfter - tBefore;
    const left = t
      .map(t => (tAfter - t) / deltaT)
      .map(t => ({ x: pointBefore.x * t, y: pointBefore.y * t }));
    const right = t
      .map(t => (t - tBefore) / deltaT)
      .map(t => ({ x: pointAfter.x * t, y: pointAfter.y * t }));
    return left.map((l, i) => ({ x: l.x + right[i].x, y: l.y + right[i].y }));
  };

  static _calculateB(
    t: number[],
    tBefore: number,
    tAfter: number,
    aBefore: Vector2[],
    aAfter: Vector2[]
  ) {
    const deltaT = tAfter - tBefore;
    const left = t
      .map(t => (tAfter - t) / deltaT)
      .map((t, i) => ({ x: aBefore[i].x * t, y: aBefore[i].y * t }));
    const right = t
      .map(t => (t - tBefore) / deltaT)
      .map((t, i) => ({ x: aAfter[i].x * t, y: aAfter[i].y * t }));
    return left.map((l, i) => ({ x: l.x + right[i].x, y: l.y + right[i].y }));
  }

  static _calculateSplinePoints(
    t: number[],
    t1: number,
    t2: number,
    b1: Vector2[],
    b2: Vector2[]
  ) {
    const deltaT = t2 - t1;
    const left = t
      .map(t => (t2 - t) / deltaT)
      .map((t, i) => ({ x: b1[i].x * t, y: b1[i].y * t }));
    const right = t
      .map(t => (t - t1) / deltaT)
      .map((t, i) => ({ x: b2[i].x * t, y: b2[i].y * t }));
    return left.map((l, i) => ({ x: l.x + right[i].x, y: l.y + right[i].y }));
  }

  static _catmullSplineFromPoints(
    [p0, p1, p2, p3]: Quadruple<Vector2>,
    alpha: number
  ): CatmullRomSpline {
    if (
      pointInvalid(p0) ||
      pointInvalid(p1) ||
      pointInvalid(p2) ||
      pointInvalid(p3)
    ) {
      console.warn('Invalid point in spline', p0, p1, p2, p3);
    }

    const t0 = 0;
    const t1 = CatmullRomCurve._calculateKnot(t0, p0, p1, alpha);
    const t2 = CatmullRomCurve._calculateKnot(t1, p1, p2, alpha);
    const t3 = CatmullRomCurve._calculateKnot(t2, p2, p3, alpha);

    return new CatmullRomSpline([p0, p1, p2, p3], [t0, t1, t2, t3]);

    // const deltaT = (t2 - t1) / CatmullRomCurve.SPLINE_FIDELITY;
    // const t = new Array(CatmullRomCurve.SPLINE_FIDELITY)
    //   .fill(0)
    //   .map((_, i) => t1 + i * deltaT);

    // calculate points between knots
    // const a1 = CatmullRomCurve._calculateA(t, t0, t1, p0, p1);
    // const a2 = CatmullRomCurve._calculateA(t, t1, t2, p1, p2);
    // const a3 = CatmullRomCurve._calculateA(t, t2, t3, p2, p3);
    // const b1 = CatmullRomCurve._calculateB(t, t0, t2, a1, a2);
    // const b2 = CatmullRomCurve._calculateB(t, t1, t3, a2, a3);

    // return CatmullRomCurve._calculateSplinePoints(t, t1, t2, b1, b2);
  }

  _calculateCurve(): CatmullRomSpline[] {
    if (this.points.length < 4) {
      return [];
    }

    const derivative = (point1: Vector2, point2: Vector2): Vector2 => {
      const EPS = 1;
      return { x: (point2.y - point1.y) / EPS, y: (point2.x - point1.x) / EPS };
    };

    // since splines require 4 control points, pad the beginning and end with control points so that the first and last are drawn
    const beginningDerivative = derivative(this.points[0], this.points[1]);
    const endDerivative = derivative(
      this.points[this.points.length - 2],
      this.points[this.points.length - 1]
    );
    const beginningControlPoint = {
      x: this.points[0].x - beginningDerivative.x,
      y: this.points[0].y - beginningDerivative.y,
    };
    const endControlPoint = {
      x: this.points[this.points.length - 1].x + endDerivative.x,
      y: this.points[this.points.length - 1].y + endDerivative.y,
    };

    const controlPoints = [
      beginningControlPoint,
      ...this.points,
      endControlPoint,
    ];

    const numSegments = controlPoints.length - 3;
    const quads: Quadruple<Vector2>[] = [];
    for (let i = 0; i < numSegments; i++) {
      quads.push(
        controlPoints.slice(i, i + 4) as [Vector2, Vector2, Vector2, Vector2]
      );
    }

    const splines = quads.map(quad =>
      CatmullRomCurve._catmullSplineFromPoints(quad, this.alpha)
    );
    return splines;
  }
}

export type CubicBezierSplineObject = {
  q0: Vector2;
  q1: Vector2;
  q2: Vector2;
  q3: Vector2;
};

export class CubicBezierSpline {
  // control points
  q0: Vector2;
  q1: Vector2;
  q2: Vector2;
  q3: Vector2;

  constructor(catmullSpline: CatmullRomSpline) {
    const [p0, p1, p2, p3] = [
      catmullSpline.p0,
      catmullSpline.p1,
      catmullSpline.p2,
      catmullSpline.p3,
    ];
    const [t0, t1, t2, t3] = [
      catmullSpline.t0,
      catmullSpline.t1,
      catmullSpline.t2,
      catmullSpline.t3,
    ];

    const c1 = (t2 - t1) / (t2 - t0);
    const c2 = (t1 - t0) / (t2 - t0);
    const d1 = (t3 - t2) / (t3 - t1);
    const d2 = (t2 - t1) / (t3 - t1);

    const [m1, m2] = CubicBezierSpline._calculateDerivatives(
      [t0, t1, t2, t3],
      [p0, p1, p2, p3],
      [c1, c2],
      [d1, d2]
    );

    this.q0 = p1;
    this.q1 = {
      x: p1.x + m1.x / 3,
      y: p1.y + m1.y / 3,
    };
    this.q2 = {
      x: p2.x - m2.x / 3,
      y: p2.y - m2.y / 3,
    };
    this.q3 = p2;

    if (
      pointInvalid(this.q0) ||
      pointInvalid(this.q1) ||
      pointInvalid(this.q2) ||
      pointInvalid(this.q3)
    ) {
      console.warn('Invalid point in spline', {
        q0: this.q0,
        q1: this.q1,
        q2: this.q2,
        q3: this.q3,
        p0: p0,
        p1: p1,
        p2: p2,
        p3: p3,
        t0: t0,
        t1: t1,
        t2: t2,
        t3: t3,
      });
    }
  }

  static _calculateDerivatives(
    [t0, t1, t2, t3]: Quadruple<number>,
    [p0, p1, p2, p3]: Quadruple<Vector2>,
    [c1, c2]: [number, number],
    [d1, d2]: [number, number]
  ): [Vector2, Vector2] {
    // calculate m1
    const t1t0 = t1 - t0;
    const t2t1 = t2 - t1;
    const t3t2 = t3 - t2;

    const m1: Vector2 = {
      x: t2t1 * ((c1 * (p1.x - p0.x)) / t1t0 + (c2 * (p2.x - p1.x)) / t2t1),
      y: t2t1 * ((c1 * (p1.y - p0.y)) / t1t0 + (c2 * (p2.y - p1.y)) / t2t1),
    };

    const m2: Vector2 = {
      x: t2t1 * ((d1 * (p2.x - p1.x)) / t2t1 + (d2 * (p3.x - p2.x)) / t3t2),
      y: t2t1 * ((d1 * (p2.y - p1.y)) / t2t1 + (d2 * (p3.y - p2.y)) / t3t2),
    };

    return [m1, m2];
  }

  static getSvgPath(spline: CubicBezierSplineObject): string {
    return `M ${spline.q0.x} ${spline.q0.y} C ${spline.q1.x} ${spline.q1.y} ${spline.q2.x} ${spline.q2.y} ${spline.q3.x} ${spline.q3.y}`;
  }

  static calculateBoundingBox(spline: CubicBezierSplineObject): BoundingBox {
    const a: Vector2 = {
      x: -spline.q0.x + 3 * spline.q1.x - 3 * spline.q2.x + spline.q3.x,
      y: -spline.q0.y + 3 * spline.q1.y - 3 * spline.q2.y + spline.q3.y,
    };
    const b: Vector2 = {
      x: 6 * spline.q0.x - 12 * spline.q1.x + 6 * spline.q2.x,
      y: 6 * spline.q0.y - 12 * spline.q1.y + 6 * spline.q2.y,
    };
    const c: Vector2 = {
      x: -3 * spline.q0.x + 3 * spline.q1.x,
      y: -3 * spline.q0.y + 3 * spline.q1.y,
    };

    const xRoots = MathUtil.quadraticRoots(a.x, b.x, c.x);
    const yRoots = MathUtil.quadraticRoots(a.y, b.y, c.y);
    const roots = [...xRoots, ...yRoots].filter(root => root >= 0 && root <= 1);

    const criticalPoints = [
      CubicBezierSpline.valueAt(spline, 0),
      CubicBezierSpline.valueAt(spline, 1),
      ...roots.map(root => CubicBezierSpline.valueAt(spline, root)),
    ];

    const [xMin, xMax, yMin, yMax] = criticalPoints.reduce(
      ([xMin, xMax, yMin, yMax], point) => [
        Math.min(xMin, point.x),
        Math.max(xMax, point.x),
        Math.min(yMin, point.y),
        Math.max(yMax, point.y),
      ],
      [Infinity, -Infinity, Infinity, -Infinity]
    );

    return [
      { x: xMin, y: yMax },
      { x: xMax, y: yMin },
    ];
  }

  static valueAt(spline: CubicBezierSplineObject, t: number): Vector2 {
    const x =
      spline.q0.x * Math.pow(1 - t, 3) +
      3 * spline.q1.x * t * Math.pow(1 - t, 2) +
      3 * spline.q2.x * Math.pow(t, 2) * (1 - t) +
      spline.q3.x * Math.pow(t, 3);
    const y =
      spline.q0.y * Math.pow(1 - t, 3) +
      3 * spline.q1.y * t * Math.pow(1 - t, 2) +
      3 * spline.q2.y * Math.pow(t, 2) * (1 - t) +
      spline.q3.y * Math.pow(t, 3);
    return { x, y };
  }

  static applyTranslation(
    spline: CubicBezierSplineObject,
    translation: Transform['translate']
  ) {
    if (!translation) {
      return spline;
    }

    return {
      q0: { x: spline.q0.x + translation.x, y: spline.q0.y + translation.y },
      q1: { x: spline.q1.x + translation.x, y: spline.q1.y + translation.y },
      q2: { x: spline.q2.x + translation.x, y: spline.q2.y + translation.y },
      q3: { x: spline.q3.x + translation.x, y: spline.q3.y + translation.y },
    };
  }

  static applyScale(
    spline: CubicBezierSplineObject,
    scale: Transform['scale'],
    centerPoint: Vector2
  ) {
    if (!scale) {
      return spline;
    }

    const scalePoint = (point: Vector2) => ({
      x: centerPoint.x + scale * (point.x - centerPoint.x),
      y: centerPoint.y + scale * (point.y - centerPoint.y),
    });

    return {
      q0: scalePoint(spline.q0),
      q1: scalePoint(spline.q1),
      q2: scalePoint(spline.q2),
      q3: scalePoint(spline.q3),
    };
  }

  static applyTransform(
    spline: CubicBezierSplineObject,
    transform: Transform,
    centerPoint?: Vector2
  ) {
    const { translate, scale } = transform;
    if (!translate && !scale) {
      return spline;
    } else if (scale && !centerPoint) {
      return spline;
    }

    const translated = CubicBezierSpline.applyTranslation(spline, translate);
    const scaled = CubicBezierSpline.applyScale(
      translated,
      scale,
      centerPoint!
    );
    return scaled;
  }

  static applyStrokeNoise(
    spline: CubicBezierSplineObject,
    noise: number,
    affectEndpoint: boolean = false
  ) {
    const direction = MathUtil.randomInt(0, 1) === 0 ? -1 : 1;
    noise *= direction;

    // get normals of the control points and apply offset
    const r1 = Vector.subtract(spline.q3, spline.q0);
    const q1Projection = Vector.add(
      Vector.scale(
        r1,
        Vector.dotProduct(Vector.subtract(spline.q1, spline.q0), r1) /
          Math.pow(Vector.magnitude(r1), 2)
      ),
      spline.q0
    );
    const q1Normal = Vector.normalize(Vector.subtract(spline.q1, q1Projection));

    const r2 = Vector.subtract(spline.q0, spline.q3);
    const q2Projection = Vector.add(
      Vector.scale(
        r2,
        Vector.dotProduct(Vector.subtract(spline.q2, spline.q3), r2) /
          Math.pow(Vector.magnitude(r2), 2)
      ),
      spline.q3
    );
    const q2Normal = Vector.normalize(Vector.subtract(spline.q2, q2Projection));

    const q3Normal = Vector.rotate(
      Vector.normalize(r1),
      (direction * Math.PI) / 2
    );

    return {
      q0: spline.q0,
      q1: Vector.add(spline.q1, Vector.scale(q1Normal, noise)),
      q2: Vector.add(spline.q2, Vector.scale(q2Normal, noise)),
      q3: affectEndpoint
        ? Vector.add(spline.q3, Vector.scale(q3Normal, noise))
        : spline.q3,
    };
  }

  toObject(): CubicBezierSplineObject {
    return {
      q0: this.q0,
      q1: this.q1,
      q2: this.q2,
      q3: this.q3,
    };
  }
}

export interface CubicBezierCurveObject extends Curve {
  splines: CubicBezierSplineObject[];
  color: string;
  width: number;
}

export class CubicBezierCurve extends Curve {
  splines: CubicBezierSpline[];
  color: string;
  width: number;
  _points: Vector2[];

  constructor(stroke: Stroke, width: number = 10, alpha: number = 0.5) {
    super();
    const catmullRomCurve = new CatmullRomCurve(stroke.points, alpha);
    const splines = catmullRomCurve.splines;
    const bezierSplines = splines.map(spline => new CubicBezierSpline(spline));
    this.splines = bezierSplines;
    this.color = stroke.color;
    this.width = width;
    this._points = stroke.points;
  }

  static getSvgPaths(curve: CubicBezierCurveObject): string[] {
    return curve.splines.map(spline => CubicBezierSpline.getSvgPath(spline));
  }

  // returns the top left and bottom right coordinates of the bounding box
  static calculateBoundingBox(splines: CubicBezierSplineObject[]): BoundingBox {
    const [xMin, xMax, yMin, yMax] = splines.reduce<Quadruple<number>>(
      (
        [xMin, xMax, yMin, yMax]: Quadruple<number>,
        spline: CubicBezierSplineObject
      ) => {
        const boundingBox = CubicBezierSpline.calculateBoundingBox(spline);

        return [
          Math.min(xMin, boundingBox[0].x),
          Math.max(xMax, boundingBox[1].x),
          Math.min(yMin, boundingBox[1].y),
          Math.max(yMax, boundingBox[0].y),
        ];
      },
      [Infinity, -Infinity, Infinity, -Infinity]
    );

    return [
      { x: xMin, y: yMax },
      { x: xMax, y: yMin },
    ];
  }

  static calculateCenterPoint(curve: CubicBezierCurveObject) {
    const [tl, br] = CubicBezierCurve.calculateBoundingBox(curve.splines);
    const { x: xMin, y: yMax } = tl;
    const { x: xMax, y: yMin } = br;

    return {
      x: (xMin + xMax) / 2,
      y: (yMin + yMax) / 2,
    };
  }

  static applyTransform(
    curve: CubicBezierCurveObject,
    transform: Transform
  ): CubicBezierCurveObject {
    const splines = curve.splines;

    const { translate, scale } = transform;
    if (!translate && !scale) {
      return curve;
    }

    const centerPoint = transform.centerPoint
      ? transform.centerPoint
      : CubicBezierCurve.calculateCenterPoint(curve);

    return {
      ...curve,
      splines: splines.map(spline =>
        CubicBezierSpline.applyTransform(spline, transform, centerPoint)
      ),
    };
  }

  static maxDistanceBetweenTwoPoints(curve: CubicBezierCurveObject) {
    const pointsOnCurve = curve.splines
      .map(spline => [spline.q0, spline.q3])
      .flat();

    let maxDistance = 0;
    for (let i = 0; i < pointsOnCurve.length; i++) {
      for (let j = i + 1; j < pointsOnCurve.length; j++) {
        maxDistance = Math.max(
          maxDistance,
          MathUtil.distance(pointsOnCurve[i], pointsOnCurve[j])
        );
      }
    }

    return maxDistance;
  }

  static applyStrokeNoise(curve: CubicBezierCurveObject, noise: number) {
    return {
      ...curve,
      splines: curve.splines.map((spline, i) =>
        CubicBezierSpline.applyStrokeNoise(
          spline,
          noise,
          i !== curve.splines.length - 1
        )
      ),
    };
  }

  toObject(): CubicBezierCurveObject {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      width: this.width,
      splines: this.splines.map(spline => spline.toObject()),
    };
  }
}

export class CurveGroup {
  static calculateBoundingBox(curves: CubicBezierCurveObject[]): BoundingBox {
    const [xMin, xMax, yMin, yMax] = curves.reduce(
      ([xMin, xMax, yMin, yMax], curve) => {
        const [tl, br] = CubicBezierCurve.calculateBoundingBox(curve.splines);
        return [
          Math.min(xMin, tl.x),
          Math.max(xMax, br.x),
          Math.min(yMin, tl.y),
          Math.max(yMax, br.y),
        ];
      },
      [Infinity, -Infinity, Infinity, -Infinity]
    );

    return [
      { x: xMin, y: yMax },
      { x: xMax, y: yMin },
    ];
  }
}
