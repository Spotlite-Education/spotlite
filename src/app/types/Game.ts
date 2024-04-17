import { Player } from './Player';

export type Game = {
  state: string;
  themes: string[];
  questionCreatingTime: number;
  questionAnsweringTime: number;
  countdown: number;
  quizzer: Player;
  hint: string;
  prevQuizzerCount: number;
};
