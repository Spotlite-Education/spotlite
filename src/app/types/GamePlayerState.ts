import { Question } from './Question';

export type GamePlayerState = {
  id: string;
  username: string;
  theme: string;
  points: number;
  rank: number;
  ascended: boolean;
  question: Question;
};
