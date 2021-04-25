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
export const createDateInterval = (startingDate, frequency = 7) => {
  const intervalStart = new Date(startingDate);
  const daysDiff = Math.ceil(daysBetween(intervalStart, new Date()));
  const intervalSize = Math.floor(daysDiff / frequency);
  const startAdjust = daysDiff % frequency;

  // Adjust the start of the interval so we can create a list of dates
  // without running into fractional issues.
  intervalStart.setDate(intervalStart.getDate() + startAdjust);

  const interval = [];
  const dateIterator = intervalStart;
  for (let i = 0; i < intervalSize; i += 1) {
    dateIterator.setDate(dateIterator.getDate() + frequency);
    let newDate = new Date();
    newDate.setTime(dateIterator.getTime());
    interval.push(newDate);
  }

  return interval;
}