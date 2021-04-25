import { createDateInterval } from "../../../helpers/dates"

export const createActivitiesHistogram = (activities, interval) => {
  const activityName = (activity) => {
    if (activity.object === 'order') {
      return activity.order_type.split('_')[0];
    } else {
      return activity.object;
    }
  }

  return groupActivitiesByPeriod(activities, interval).map((group) => {
    const groupHistogram = {
      name: group.date,
    };

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

const groupActivitiesByPeriod = (activities, period) => {
  if (activities.length === 0) {
    return [];
  }

  const dates = createDateInterval(activities[activities.length - 1].created_at, period);

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