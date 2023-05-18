import React from 'react';
import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import { Typography } from "@mui/material";

const colors = {
  green: '#00C49F',
  orange: '#FFA500',
  red: '#FF0000',
};

const getFillColor = value => {
  if (value >= 0 && value <= 3.9) {
    return colors.green;
  } else if (value >= 4 && value <= 6.9) {
    return colors.orange;
  } else if (value >= 7 && value <= 10) {
    return colors.red;
  }
};

const Circle = ({ value }) => {
  const data = [{ value: value }, { value: (10 - value), fill: '#d3d3d3'  }];
      
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          innerRadius="80%"
          outerRadius="100%"
          minAngle={1}
          domain={[0, 10]}
          stroke="none"
          strokeWidth={0}
          fill={getFillColor(value)}
        />
        <foreignObject width="100%" height="100%" style={{textAlign: "center"}}>
          <Typography variant="h4" color="textSecondary" sx={{display: "inline-block", position: "relative", top: "50%", transform: "translateY(-50%)"}}>
            {value}
          </Typography>
        </foreignObject>
      </PieChart>
    </ResponsiveContainer>


  );
};

export default Circle;
