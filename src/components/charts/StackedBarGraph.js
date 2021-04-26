import React from 'react';
import {
  makeStyles,
  Grid,
  useTheme
} from '@material-ui/core';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const styles = makeStyles(theme => ({
  chartContainer: {
    minHeight: 200,
    flexDirection: 'column',
    margin: `${theme.spacing(1)}px 0px`,
  }
}));

const StackedBarGraph = (props) => {
  const theme = useTheme();
  const classes = styles(props);

  const xAxisPoints = () => {
    // Compute the new x-axis point
    if (props.data.length < 6) {
      // not enough data, use all points as x-axis
      return props.data.map((day) => day.name);
    } else {
      // we have enough data to spread out the points
      const jump = Math.floor(props.data.length / 3);
      const points = props.data.filter((day, index) => index % jump === 0);
      return points.map((day) => day.name);
    }
  }

  return (
    <Grid container className={classes.chartContainer}>
      <Grid item>
        <ResponsiveContainer width={"95%"} height={200}>
          <BarChart
            data={props.data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" ticks={xAxisPoints()} />
            <YAxis />
            <Tooltip itemStyle={{
              background: theme.palette.background.main,
              padding: theme.spacing(1),
            }}
            />
            {
              props.colors.map((line, id) =>
                <Bar
                  key={id}
                  dataKey={line.id}
                  stackId="a"
                  fill={line.color}
                />
              )
            }
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}

export default StackedBarGraph;