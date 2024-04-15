import { Player } from './Player';

export type Leaderboard = {
  [playerId: string]: Player;
};

export type FinalLeaderboard = Player[];
