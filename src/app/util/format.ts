// formats seconds into hh:mm:ss
export const formatSeconds = (time: number): string => {
  const hours = Math.floor(time / (60 * 60));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  let formatted = '';
  if (hours > 0) {
    formatted += hours + ':';
  }
  formatted += minutes + ':';
  formatted += seconds < 10 ? '0' + seconds : seconds;

  return formatted;
};

const endings = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th'];
export const formatRank = (rank: number): string => {
  const lastDigit = rank % 10;
  return `${rank}${endings[lastDigit]}`;
};
