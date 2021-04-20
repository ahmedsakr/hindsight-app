import React from 'react';
import {
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { AreaChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Area } from 'recharts';

const styles = makeStyles(theme => ({
  root: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    flex: 1
  },
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
  chartContainer: {
    minHeight: 200,
    flexDirection: 'column',
  }
}));

// Rounds an number to the specified decimal points
const roundTo = (num, digits) => Math.round((num + Number.EPSILON) * (10^digits)) / (10^digits);

/**
 * Synchronize the two lists by guaranteeing that the start and end of both lists
 * have matching dates. This means trimming off some entries that aren't found in both.
 */
const synchronizeData = (account, veqt) => {

  // make a copy of the arrays
  let [ accountPerformance, veqtPerformance ] = [ [ ...account], [ ...veqt ] ];

  // the user does not have 1 year of performance on this account. We must
  // shrink the veqtPerformance list down to the appropriate size.
  if (accountPerformance[0].date !== veqtPerformance[0].date) {
    const startingDate = veqtPerformance.findIndex((day) => day.date === accountPerformance[0].date);
    veqtPerformance = veqtPerformance.slice(startingDate, veqtPerformance.length);
  }

  // The ending doesn't match. Need to find out whether to trim account list or veqt list.
  if (accountPerformance[accountPerformance.length - 1].date !== veqtPerformance[veqtPerformance.length - 1].date) {
    const adjustAccount = accountPerformance.findIndex((day) => day.date === veqtPerformance[veqtPerformance.length - 1].date);
    const adjustVeqt = veqtPerformance.findIndex((day) => day.date === accountPerformance[accountPerformance.length - 1].date);

    if (adjustAccount > -1) {
      accountPerformance = accountPerformance.slice(0, adjustAccount + 1);
    } else {
      veqtPerformance = veqtPerformance.slice(0, adjustVeqt + 1);
    }
  }

  return { accountPerformance, veqtPerformance };
}

const buildData = (account, performance, veqt) => {

  const veqtDayGain = (index) => {
    // we dont register any VEQT gains on the first day or if the user
    // has no investments on this day (equity value === 0)
    if (index === 0 || performance[index].equity_value.amount <= 0) {
      return 0;
    }

    const dayPercentGain = (veqt[index].adjusted_price - veqt[index - 1].adjusted_price) / veqt[index - 1].adjusted_price;
    return dayPercentGain * performance[index].net_deposits.amount;
  }

  let veqtTotalGain = 0, accountTotalGain = 0;
  let startingPortfolioGain = performance[0].value.amount - performance[0].net_deposits.amount;

  return performance.map((day, i) => {
    veqtTotalGain += veqtDayGain(i);
    accountTotalGain = (day.value.amount - day.net_deposits.amount) - startingPortfolioGain;
    
    return {
      name: day.date,
      [account]: roundTo(accountTotalGain, 2),
      VEQT: roundTo(veqtTotalGain, 2)
    }
  });
}

const InsightText = (props) => {
  const { data } = props;
  const theme = useTheme();
  const classes = styles(props);
  const gainOverVeqt = data[data.length - 1][props.account] - data[data.length - 1].VEQT;
  const startingDate = new Date(data[0].name).toDateString();

  return (
    <Grid container className={classes.insightInfo}>
      <Typography
        color="secondary"
        className={classes.insightMetric}
      >
        <span
          style={{
            color: gainOverVeqt < 0 ? 'red' : theme.palette.primary.main,
          }}
        >
          {` $${parseFloat(Math.abs(gainOverVeqt).toFixed(2))} CAD `}
          {gainOverVeqt < 0 ? ` ↓ ` : ` ↑ `}
        </span>
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
  const classes = styles(props);
  const userData = props.location.state;

  const [ data, setData ] = React.useState(null);
  const [ xAxisPoints, setXAxisPoints ] = React.useState(null);

  React.useEffect(() => {
    let account = userData.performance[props.account.toLowerCase()].results;
    let veqt = userData.securities.history.veqt.results;

    // Some dates come with the time; we remove it because we aren't interested
    // in time for now.
    account = account.map((day) => ({ ...day, date: day.date.split("T")[0]}));

    // Synchronize account and veqt lists by making sure the date ranges
    // line up.
    let { accountPerformance, veqtPerformance } = synchronizeData(account, veqt);
  
    const graphData = buildData(props.account, accountPerformance, veqtPerformance);
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
  
  }, [ props.account, userData ]);

  if (!data) {
    return <></>;
  }

  return (
    <Grid container className={classes.root}>
      <InsightText data={data} account={props.account} />
      <Grid container className={classes.chartContainer}>
        <Grid item>
          <ResponsiveContainer width={"95%"} height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="VEQT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="orange" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="orange" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" ticks={xAxisPoints} />
              <YAxis />
              <Tooltip itemStyle={{
                  background: theme.palette.background.main,
                  padding: theme.spacing(1),
                }}
              />
              <Legend />
              <Area type="monotone" dataKey={props.account} stroke={theme.palette.primary.main} dot={false} fill="url(#colorUv)" fillOpacity={1}/>
              <Area type="monotone" dataKey="VEQT" stroke={'orange'} dot={false} fill="url(#VEQT)" fillOpacity={1}/>
            </AreaChart>
          </ResponsiveContainer>
        </Grid>

      </Grid>
    </Grid>
  );
}

export default VEQTComparison;