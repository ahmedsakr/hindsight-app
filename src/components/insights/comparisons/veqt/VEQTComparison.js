import React, {
  useEffect,
  useState
} from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import AreaGraph from '../../../charts/AreaGraph';
import buildComparison from '../comparator';
import { useScreenSize } from '../../../../helpers/screen';
import { roundTo } from '../../../../helpers/arithmetic';

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
  const roundedGain = roundTo(Math.abs(gainOverVeqt), 2).toLocaleString();
  const startingDate = new Date(data[0].name).toISOString().split("T")[0];

  return (
    <Grid container className={classes.insightInfo}>
      <Typography
        color="secondary"
        className={classes.insightMetric}
        style={{ color: gainOverVeqt < 0 ? 'red' : theme.palette.primary.main }}
      >
          {(` $${roundedGain} CAD `) + (gainOverVeqt < 0 ? ` ↓ ` : ` ↑ `)}
      </Typography>
      <Typography
        color="secondary"
        className={classes.insightDescription}
      >
        Since {startingDate}, your {props.account} has returned
        {` $${roundedGain} CAD`} {gainOverVeqt < 0 ? `less` : `more`} compared
        to if your {props.account} was 100% Vanguard All-Equity ETF (VEQT)
      </Typography>
    </Grid>
  );
}

const VEQTComparison = (props) => {
  const theme = useTheme();
  const screen = useScreenSize();
  const classes = styles({ ...props, screen });
  const [ data, setData ] = useState(null);
  const targetKey = 'VEQT';

  useEffect(() => {
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
        yAxisFormatter={(number) => `$${number.toLocaleString()}`}
      />
    </Grid>
  );
}

export default VEQTComparison;
