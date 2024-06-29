import { Player } from './Player';
import { Settings } from './Settings';

export type GameState = {
  stage:
    | 'LOBBY'
    | 'CREATE_QUESTIONS'
    | 'CHOOSE_QUIZZER'
    | 'ANSWER_QUESTION'
    | 'REVEAL_ANSWER'
    | 'EDIT_QUESTION'
    | 'SHOW_LEADERBOARD'
    | 'FINAL_RESULTS';
  ID: string;
  isAdmin: boolean;
  players: Player[];
  settings: Settings;
  createdAt: string;
};
