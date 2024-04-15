import { Player } from './Player';

export type Guess = {
  player: Player;
  guess: string;
  correct: boolean;
  points: string;
};
