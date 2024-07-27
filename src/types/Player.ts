export type BasicPlayerInfo = {
  username: string;
  characterSubmitted: boolean;
  points: number;
};

export type CompletePlayerInfo = BasicPlayerInfo & {
  ID: string;
  question: any;
};
