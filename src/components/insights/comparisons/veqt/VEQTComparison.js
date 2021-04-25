import React from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import AreaGraph from '../../../charts/AreaGraph';
import buildComparison from '../comparator';
import { useScreenSize } from '../../../../helpers/screen';

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
  const { data } = props;
  const theme = useTheme();
  const classes = styles(props);
  const gainOverVeqt = data[data.length - 1][props.account] - data[data.length - 1][props.target];
  const startingDate = new Date(data[0].name).toISOString().split("T")[0];

  return (
    <Grid container className={classes.insightInfo}>
      <Typography
        color="secondary"
        className={classes.insightMetric}
        style={{ color: gainOverVeqt < 0 ? 'red' : theme.palette.primary.main }}
      >
          {` $${parseFloat(Math.abs(gainOverVeqt).toFixed(2))} CAD `}
          {gainOverVeqt < 0 ? ` ↓ ` : ` ↑ `}
      </Typography>
      <Typography
        color="secondary"
        className={classes.insightDescription}
      >
        Since {startingDate}, your {props.account} has returned
        {` $${Math.abs(gainOverVeqt)} CAD`} {gainOverVeqt < 0 ? `less` : `more`} compared
        to if your {props.account} was 100% Vanguard All-Equity ETF (VEQT)
      </Typography>
    </Grid>
  );
}

const VEQTComparison = (props) => {
  const theme = useTheme();
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
  const [ data, setData ] = React.useState(null);
  const [ xAxisPoints, setXAxisPoints ] = React.useState(null);
  const targetKey = 'VEQT';

  React.useEffect(() => {
    const userData = props.location.state;
    const accountId = userData.accounts[props.account.toLowerCase()];

    let account = userData.performance[props.account.toLowerCase()].results;
    let target = userData.securities.history.veqt[props.dateRange === 'all' ? '5y': props.dateRange].results;

    // Some dates come with the time; we remove it because we aren't interested
    // in them for now.
    account = account.map((day) => ({ ...day, date: day.date.split("T")[0]}));
  
    const graphData = buildComparison(
      {
        key: props.account,
        data: account,
        deposits: userData.activities.filter((activity) => activity.account_id === accountId),
      },
      {
        key: targetKey,
        data: target
      }
    );
    setData(graphData);

    // Compute the new x-axis point
    if (graphData.length < 6) {
      // not enough data, use all points as x-axis
      setXAxisPoints(graphData.map((day) => day.name));
    } else {
      // we have enough data to spread out the points
      const jump = Math.floor(graphData.length / 5);
      const points = graphData.filter((day, index) => index % jump === 0);
      setXAxisPoints(points.map((day) => day.name));
    }
  
  }, [ props.account, props.dateRange, props.location.state ]);

  if (!data) {
    return <></>;
  }

  return (
    <Grid container className={classes.root}>
      <InsightText
        data={data}
        account={props.account}
        target={targetKey}
      />
      <AreaGraph
        data={data}
        account={props.account}
        xAxisPoints={xAxisPoints}
        colors={[
          {
            id: props.account,
            color: theme.palette.primary.main
          },
          {
            id: targetKey,
            color: "orange"
          }
        ]}
      />
    </Grid>
  );
}

export default VEQTComparison;
