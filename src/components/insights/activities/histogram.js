import { createDateInterval } from "../../../helpers/dates"

const intervalToPeriod = (interval) => {
  if (interval === '1m' || interval === '3m') {
    return '1w';
  } else if (interval === '1y' || interval === 'all') {
    return '1m';
  }
}

export const createActivitiesHistogram = (activities, startDate, interval) => {
  const activityName = (activity) => {
    if (activity.object === 'order') {
      return activity.order_type.split('_')[0];
    } else {
      return activity.object;
    }
  }

  return groupActivitiesByPeriod(activities, startDate, intervalToPeriod(interval)).map((group) => {
    const groupHistogram = { name: group.date, };

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
  const dates = createDateInterval(startDate, period);

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