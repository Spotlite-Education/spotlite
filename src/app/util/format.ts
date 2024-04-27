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
