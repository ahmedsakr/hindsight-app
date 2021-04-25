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
            <XAxis dataKey="name" />
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