import { Question } from './Question';

export type Player = {
  id: string;
  isAdmin: boolean;
  username: string;
  points: number;
  question: Question | null;
  rank: number;
  ascended: boolean;
};
