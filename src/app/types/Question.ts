import { CanvasAction } from '../[roomCode]/page';

export type Question = {
  type: 'draw' | 'text';
  content: CanvasAction[] | string;
};

export type Answer = string;
