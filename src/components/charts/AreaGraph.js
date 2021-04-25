import React from 'react';
import {
  makeStyles,
  useTheme,
  Grid
} from '@material-ui/core';

import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Area
} from 'recharts';

const styles = makeStyles(theme => ({
  chartContainer: {
    minHeight: 200,
    flexDirection: 'column',
    margin: `${theme.spacing(1)}px 0px`,
  }
}));

const AreaGraph = (props) => {

  const theme = useTheme();
  const classes = styles(props);

  return (
    <Grid container className={classes.chartContainer}>
      <Grid item>
        <ResponsiveContainer width={"95%"} height={200}>
          <AreaChart data={props.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" ticks={props.xAxisPoints} />
            <YAxis />
            <Tooltip itemStyle={{
              background: theme.palette.background.main,
              padding: theme.spacing(1),
            }}
            />
            <Legend />
            <defs>
              {
                props.colors.map((line, id) => {
                  return (
                    <linearGradient key={id} id={line.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={line.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={line.color} stopOpacity={0} />
                    </linearGradient>
                  );
                })
              }
            </defs>
            {
              props.colors.map((line, id) => {
                return (
                  <Area
                    key={id}
                    type="monotone"
                    dataKey={line.id}
                    stroke={line.color}
                    dot={false}
                    fill={`url(#${line.id})`}
                    fillOpacity={1}
                  />
                );
              })
            }
          </AreaChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default AreaGraph;