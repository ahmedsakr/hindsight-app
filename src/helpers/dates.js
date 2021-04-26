/**
 * Calculates number of days between the dates provided
 */
export const daysBetween = (date1, date2) => {
  const startDate = new Date(date1).getTime();
  const endDate = new Date(date2).getTime();
  return (endDate - startDate) / (1000 * 60 * 60 * 24);
}

/**
 * Creates a list of dates from the provided starting date up until today,
 * using the provided frequency as the delta between dates.
 */
export const createDateInterval = (startingDate, frequency = 'd') => {
  let intervalStart = new Date(startingDate);

  if (frequency === '1m' || frequency === '3m') {
    // we start from the beginning of the month if we are creating a monthly or quarterly interval
    intervalStart = new Date(intervalStart.getFullYear(), intervalStart.getMonth(), 1);
  }

  const nextDate = (date) => {
    if (frequency === '1w') {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
    } else if (frequency === '1m') {
      return new Date(date.getFullYear(), date.getMonth() + 1);
    } else if (frequency === '3m') {
      return new Date(date.getFullYear(), date.getMonth() + 3);
    } else {
      // '1d' frequency or it was not recognized
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    }
  }

  const interval = [intervalStart];
  const now = new Date();
  let appendDate = nextDate(intervalStart);

  while (appendDate < now) {
    interval.push(appendDate);
    appendDate = nextDate(appendDate);
  }

  return interval;
}