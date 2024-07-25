export type BasicPlayerInfo = {
  username: string;
  characterID: string;
  points: number;
};

export type CompletePlayerInfo = BasicPlayerInfo & {
  ID: string;
  question: any;
};
