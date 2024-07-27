import { CubicBezierCurveObject } from '@/app/lib/Curves';
import { createContext } from 'react';

export const CharacterContext = createContext<CubicBezierCurveObject[] | null>(
  null
);
