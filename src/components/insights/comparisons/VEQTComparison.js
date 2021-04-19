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
    alignItems: "center"
  },
  insightInfo: {
    fontSize: 24,
    width: "75%",
    textAlign: "center"
  }
}));

const buildData = (account, performance, veqt) => {
  const veqtDayGain = (index) => {
    if (index === 0 || performance[index].net_deposits.amount < 0) {
      return 0;
    }

    return ((veqt[index].adjusted_price - veqt[index - 1].adjusted_price) / veqt[index - 1].adjusted_price) * performance[index].net_deposits.amount
  }
  const data = [];
  let veqtTotalGain = 0;
  let startingPortfolioGain = performance[0].value.amount - performance[0].net_deposits.amount

  for (let i = 0; i < performance.length; i += 1) {
    veqtTotalGain += veqtDayGain(i);

    data.push({
      name: performance[i].date,
      [account]: (performance[i].value.amount - performance[i].net_deposits.amount) - startingPortfolioGain,
      VEQT: veqtTotalGain
    })
  }

  return data;
}

const InsightText = (props) => {
  const { data } = props;
  const theme = useTheme();
  const classes = styles(props);
  const gainOverVeqt = data[data.length - 1].tfsa - data[data.length - 1].VEQT;
  const startingDate = new Date(data[0].name).toDateString();

  return (
    <Typography
      color="secondary"
      className={classes.insightInfo}
    >
      Since {startingDate}, your {props.account} has returned
      <span
        style={{
          color: gainOverVeqt < 0 ? 'red' : theme.palette.primary.main,
        }}
      >
        {` $${Math.round(Math.abs(gainOverVeqt))} CAD `}
        {gainOverVeqt < 0 ? ` ↓ ` : ` ↑ `}
      </span>
      less than
      a 100% Vanguard All-Equity ETF (VEQT) portfolio
    </Typography>
  );
}

const VEQTComparison = (props) => {
  const theme = useTheme();
  const classes = styles(props);
  const userData = props.location.state;

  const data = buildData('tfsa', userData.performance.tfsa.results, userData.securities.history.veqt.results);

  return (
    <Grid container className={classes.root}>
      <InsightText data={data} account='TFSA' />
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
              <Area type="monotone" dataKey="tfsa" stroke={theme.palette.primary.main} dot={false} fill="url(#colorUv)" fillOpacity={1}/>
              <Area type="monotone" dataKey="VEQT" stroke={'orange'} dot={false} fill="url(#VEQT)" fillOpacity={1}/>
            </AreaChart>
          </ResponsiveContainer>
        </Grid>

      </Grid>
    </Grid>
  );
}

export default VEQTComparison;