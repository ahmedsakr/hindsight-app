import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const StackedBarGraph = (props) => {
  return (
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
        <Tooltip />
        <Legend />
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
  );
}

export default StackedBarGraph;