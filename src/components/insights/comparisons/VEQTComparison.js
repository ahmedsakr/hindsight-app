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
    fontSize: 24,
    fontWeight: 700,
  },
  insightDescription: {
    fontSize: 16,
  }
}));

// Rounds an number to the specified decimal points
const roundTo = (num, digits) => Math.round((num + Number.EPSILON) * (10^digits)) / (10^digits);

const buildData = (account, performance, veqt) => {
  const veqtDayGain = (index) => {
    if (index === 0 || performance[index].net_deposits.amount < 0) {
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

  React.useEffect(() => {
    setData(buildData(props.account, userData.performance[props.account.toLowerCase()].results, userData.securities.history.veqt.results))
  }, [ props.account ]);

  if (!data) {
    return <></>
  }
  return (
    <Grid container className={classes.root}>
      <InsightText data={data} account={props.account} />
      <Grid container style={{ minHeight: 200, flexDirection: 'column', position: 'relative' }}>
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
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