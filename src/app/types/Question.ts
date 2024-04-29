import { CanvasAction } from '../[roomCode]/page';
import { SlateValue } from '../components/Slate/types/Properties';

export type Question = {
  slate: SlateValue;
  answer: Answer;
};

export type Answer = string;
