// formats seconds into mm:ss
export const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatRank = (rank: number): string => {
  const str = rank.toString();
  if (str.length >= 2) {
    const ending = str.slice(-2);
    if (ending === '11' || ending === '12' || ending === '13') {
      return str + 'th';
    }
  }

  const ending = str[str.length - 1];
  if (ending === '1') {
    return str + 'st';
  } else if (ending === '2') {
    return str + 'nd';
  } else if (ending === '3') {
    return str + 'rd';
  }

  return str + 'th';
};
