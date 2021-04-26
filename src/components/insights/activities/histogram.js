import { createDateInterval } from "../../../helpers/dates"

/**
 * Converts the user-chosen interval to the period between data points.
 */
const intervalToPeriod = (interval) => {
  if (interval === '1m' || interval === '3m') {
    return '1w';
  } else if (interval === '1y' || interval === 'all') {
    return '1m';
  }
}

/**
 * Prettifies the stored date by taking it from its raw form into
 * an appropriate string to show the user:
 * - If we are on a monthly period for data points, we will simply display
 * the month and the year (e.g., January 2021)
 * - If we are on a week period for data points, we will display prefix
 * "Week of" before the date (e.g., Week of January 13)
 */
const prettifyDate = (date, interval) => {
  if (interval === '1m' || interval === '3m') {
    return `Week of ${new Date(date).toLocaleString('default', { month: 'long', day: 'numeric' })}`;
  } else if (interval === '1y' || interval === 'all') {
    return new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}

/**
 * Given the lsit of activites, start date, and interval, we will generate
 * the data set that the Recharts.js bar chart requires to plot
 * a stacked bar chart.
 */
export const createActivitiesHistogram = (activities, startDate, interval) => {
  const activityName = (activity) => {

    // we want to distinguish between sells and buys on the histogram, rather
    // than just displaying 'order'.
    if (activity.object === 'order') {
      return activity.order_type.split('_')[0];
    } else {
      return activity.object;
    }
  }

  return groupActivitiesByPeriod(activities, startDate, intervalToPeriod(interval)).map((group) => {
    const groupHistogram = { name: prettifyDate(group.date, interval), };

    group.activities.forEach((activity) => {
      const name = activityName(activity);
      if (!(name in groupHistogram)) {
        groupHistogram[activityName(activity)] = 1;
      } else {
        groupHistogram[activityName(activity)] += 1;
      }
    });

    return groupHistogram;
  });
}

const groupActivitiesByPeriod = (activities, startDate, period) => {
  // Generates the list of dates on which our dataset will be based on
  const dates = createDateInterval(startDate, period);

  // Partition activities into the appropriate date band that they belong on.
  // This will allow us to finally iterate on them in the last step to compute
  // the histogram.
  return dates.map((date, idx) => ({
    date: date.toISOString(),
    activities: activities.filter((activity) => {
      const activityDate = new Date(activity.created_at);
      if (activityDate < date) {
        return false;
      }

      return idx === dates.length - 1 || activityDate < dates[idx + 1];
    })
  }));
}