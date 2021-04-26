import React from 'react';
import {
  makeStyles,
  Grid,
  useTheme,
  Typography,
} from '@material-ui/core';
import { useScreenSize } from '../../../helpers/screen';
import StackedBarGraph from '../../charts/StackedBarGraph';
import { createActivitiesHistogram } from './histogram';

const styles = makeStyles(theme => ({
  root: props => ({
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
    padding: props.screen === 'small' ? `${theme.spacing(4)}px 0px` : 0,
  }),
  insightInfo: {
    flexDirection: 'column',
    width: "75%",
    textAlign: "center",
    margin: `${theme.spacing(2)}px 0px`
  },
  insightMetric: {
    fontSize: 28,
    fontWeight: 700,
  },
  insightDescription: {
    fontSize: 16,
  },
}));

const InsightText = (props) => {
  const theme = useTheme();
  const classes = styles(props);
  const startingDate = props.data[0].name;

  return (
    <Grid container className={classes.insightInfo}>
      <Typography
        color="secondary"
        className={classes.insightMetric}
        style={{ color: theme.palette.primary.main }}
      >
          {`${props.totalActivites} Activities`}
      </Typography>
      <Typography
        color="secondary"
        className={classes.insightDescription}
      >
        Your {props.account} has recorded a total of {props.totalActivites} activities since
        {` ${startingDate.startsWith('Week') ? 'the' : ''} ${startingDate}`}.
      </Typography>
    </Grid>
  );
}

const StackedActivities = (props) => {
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
  const [ data, setData ] = React.useState(null);
  const [ activitiesCount, setActivitiesCount ] = React.useState(0);

  React.useEffect(() => {
    const userData = props.location.state;
    const accountId = userData.accounts[props.account.toLowerCase()];
    let activities = userData.activities.filter((activity) => activity.account_id === accountId);

    const now = new Date();
    let startDate = now;

    if (props.dateRange === '1m') {
      startDate.setDate(0);
    } else if (props.dateRange === '3m') {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (props.dateRange === '1y') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else if (props.dateRange === 'all') {
      startDate = new Date(activities[activities.length - 1].created_at);
    }

    // Eliminate all activites that occur before the start date.
    activities = activities.filter((activity) => new Date(activity.created_at) >= startDate);

    setData(createActivitiesHistogram(activities, startDate, props.dateRange));
    setActivitiesCount(activities.length);

  }, [ props.location.state, props.account, props.dateRange ]);

  if (!data) {
    return null;
  }

  return (
    <Grid container className={classes.root}>
      <InsightText
        data={data}
        account={props.account}
        totalActivites={activitiesCount}
      />
      <StackedBarGraph
        data={data}
        colors={[
          { id: 'buy', color: '#2ab7ca' },
          { id: 'sell', color: '#fe4a49' },
          { id: 'deposit', color: '#fed766' },
          { id: 'withdrawal', color: '#35a79c' },
          { id: 'dividend', color: '#f37736' },
          { id: 'institutional_transfer', color: '#aaaaaa' },
          { id: 'internal_transfer', color: '#bbbbbb' },
          { id: 'refund', color: '#96ceb4' },
          { id: 'referral_bonus', color: '#4b3832' },
          { id: 'user_bonus', color: '#4b3832' },
          { id: 'affiliate', color: '#4b3832' }
        ]}
      />
    </Grid>
  );
}

export default StackedActivities;