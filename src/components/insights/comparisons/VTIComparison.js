import React from 'react';
import {
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid, ResponsiveContainer } from 'recharts';

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

const VTIComparison = (props) => {
  const classes = styles(props);
  const data = [
    {
      name: 'Page A',
      portfolio: 4000,
      vti: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      portfolio: 3000,
      vti: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      portfolio: 2000,
      vti: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      portfolio: 2780,
      vti: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      portfolio: 1890,
      vti: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      portfolio: 2390,
      vti: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      portfolio: 3490,
      vti: 4300,
      amt: 2100,
    },
  ];
  return (
    <Grid container className={classes.root}>
      <Typography
        color="secondary"
        className={classes.insightInfo}
      >
        Since April 29, 2019, your portfolio has returned 9% less than
        the Vanguard Total Index ETF (VTI)
      </Typography>
      <Grid container style={{ minHeight: 200, flexDirection: 'column', position: 'relative' }}>
        <Grid item>
          <ResponsiveContainer width={"95%"} height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="portfolio" stroke="#8884d8" />
              <Line type="monotone" dataKey="vti" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </Grid>

      </Grid>
    </Grid>
  );
}

export default VTIComparison;