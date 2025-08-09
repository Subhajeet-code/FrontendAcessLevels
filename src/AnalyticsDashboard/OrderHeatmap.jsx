import React from "react";
import { Card } from "antd";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const orderData = [
  { grayPart: 20, greenPart: 20 },
  { grayPart: 30, greenPart: 30 },
  { grayPart: 15, greenPart: 15 },
  { grayPart: 20, greenPart: 20 },
  { grayPart: 30, greenPart: 30 },
  { grayPart: 15, greenPart: 15 },
  { grayPart: 20, greenPart: 20 },
  { grayPart: 30, greenPart: 30 },
  { grayPart: 15, greenPart: 15 },
];

const OrderHeatmap = () => {
  return (
    <Card className="p-6 col-span-2">
      <h3 className="text-lg font-bold mb-4">Order Heatmap</h3>
      <ResponsiveContainer width="60%" height={300}>
        <BarChart data={orderData}>
          <XAxis tick={false} axisLine={true} />
          <Tooltip />
          <Bar dataKey="grayPart" stackId="stack" fill="gray" />
          <Bar dataKey="greenPart" stackId="stack" fill="#8bc34a" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default OrderHeatmap;
