import { CanvasAction } from '../[roomCode]/page';

export type Question = {
  text: string;
  imageURL: string;
  answer: Answer;
};

export type Answer = string;
