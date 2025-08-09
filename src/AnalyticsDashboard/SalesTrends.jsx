import React from "react";
import { Card } from "antd";
import { BarChart, Bar, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const salesData = [
  { name: "Q1", value: 80 },
  { name: "Q2", value: 60 },
  { name: "Q3", value: 70 },
  { name: "Q4", value: 90 },
];

const SalesTrends = () => {
  return (
    <Card className="col-span-2">
      <h3 className="text-lg font-bold mb-4">Sales Trends</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={salesData} layout="vertical">
          <YAxis dataKey="name" type="category" tick={false} />
          <Tooltip />
          <Bar
            dataKey="value"
            barSize={20}
            shape={(props) => {
              const { x, y, width, height } = props;
              return (
                <g>
                  <rect x={x} y={y} width={width / 2} height={height} fill="gray" />
                  <rect x={x + width / 2} y={y} width={width / 2} height={height} fill="#8bc34a" />
                </g>
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalesTrends;
