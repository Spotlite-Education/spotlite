import { BasicPlayerInfo, CompletePlayerInfo } from './Player';
import { Settings } from './Settings';

export type GameState = {
  stage:
    | 'LOBBY'
    | 'STARTING_GAME'
    | 'CREATE_QUESTIONS'
    | 'NOT_ENOUGH_QUESTIONS'
    | 'WARN_NUM_QUESTIONS'
    | 'CHOOSE_QUIZZER'
    | 'ANSWER_QUESTION'
    | 'REVEAL_ANSWER'
    | 'EDIT_QUESTION'
    | 'SHOW_LEADERBOARD'
    | 'FINAL_RESULTS';
  ID: string;
  countdown: {
    secondsLeft: number;
  };
  createdAt: string;
} & (
  | {
      isAdmin: true;
      players: CompletePlayerInfo[];
      settings: Settings;
      playerInfo: null;
    }
  | {
      isAdmin: false;
      players: BasicPlayerInfo[];
      settings: null;
      playerInfo: CompletePlayerInfo;
    }
);
