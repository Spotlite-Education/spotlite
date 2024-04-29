import { Dispatch, SetStateAction } from 'react';
import { Functionality } from '../constants/functions';

export type Size =
  | {
      width: number;
      height: number;
    }
  | { fill: true };

export type Theme = {
  rounding?: string | number;
  border?: string;
  background?: string;
  canvas?: {
    defaultColor?: string;
    minStrokeSize?: number;
    maxStrokeSize?: number;
    minTextSize?: number;
    maxTextSize?: number;
    numSteps?: number;
    defaultSizeStep?: number;
    background?: string;
    note?: {
      textColor?: string;
      border?: string;
      background?: string;
    };
  };
  sidebar?: {
    border?: string;
    background?: string;
  };
};

export type Actions =
  | {
      readonly: boolean;
    }
  | {
      disable?: Functionality[];
    };

export type CanvasAction = {
  type: 'drawLine' | 'addText' | 'clear';
  data: any;
};

export interface CanvasElement {
  color: string;
}

export interface Line extends CanvasElement {
  width: number;
  points: [number, number][];
}

export interface Text extends CanvasElement {
  id: string;
  size: number;
  x: number;
  y: number;
  value: string;
}

export type Controllable = {
  value?: CanvasAction[];
  setValue?: Dispatch<SetStateAction<CanvasAction[]>>;
  undos?: CanvasAction[];
  setUndos?: Dispatch<SetStateAction<CanvasAction[]>>;
};

export type SlateValue = CanvasAction[];
