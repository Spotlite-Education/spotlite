import {
  CubicBezierCurve,
  CubicBezierCurveObject,
  CubicBezierSpline,
  CurveGroup,
} from '@/app/lib/Curves';
import { useMemo } from 'react';
import styles from './Character.module.scss';

interface CharacterProps {
  width: string | number;
  height: string | number;
  curves: CubicBezierCurveObject[];
  animated?: boolean;
}

export const Character = ({
  width,
  height,
  curves,
  animated,
}: CharacterProps) => {
  const scaled = useMemo(() => {
    const boundingBox = CurveGroup.calculateBoundingBox(curves);
    const transformCenter = {
      x: (boundingBox[0].x + boundingBox[1].x) / 2,
      y: (boundingBox[0].y + boundingBox[1].y) / 2,
    };

    const scaledCurves = curves.map(curve =>
      CubicBezierCurve.applyTransform(curve, {
        scale: 0.9,
        centerPoint: transformCenter,
      })
    );

    return scaledCurves.map((curve, i) => (
      <g key={i}>
        {curve.splines.map((spline, j) => (
          <path
            key={j}
            d={CubicBezierSpline.getSvgPath(spline)}
            stroke={curve.color}
            strokeWidth={10}
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </g>
    ));
  }, [curves]);

  return (
    <svg
      className={`${styles.wrapper} ${animated ? styles.animated : undefined}`}
      width={width}
      height={height}
    >
      <g className={styles.original}>
        {curves.map((curve, i) => (
          <g key={i}>
            {curve.splines.map((spline, j) => (
              <path
                key={j}
                d={CubicBezierSpline.getSvgPath(spline)}
                stroke={curve.color}
                strokeWidth={10}
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>
        ))}
      </g>
      <g className={styles.scaled}>{scaled}</g>
    </svg>
  );
};
