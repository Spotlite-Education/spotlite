import { Player } from './Player';
import { Settings } from './Settings';

export type GameState = {
  ID: string;
  isAdmin: boolean;
  players: Player[];
  settings: Settings;
  createdAt: string;
};
